from django.conf import settings
from django.db import models
from django.utils.text import slugify
from django.core.validators import FileExtensionValidator
from . import utils
from PIL import Image
import os


def book_directory_path(instance, filename):
    filename = f"{instance.title_slug}.{filename.split('.')[-1]}"
    return f"books/{instance.title_slug}/{filename}"


def convert_to_png(image):
    if image.name.split(".")[-1].lower() != "png":
        img = Image.open(image.path)
        png_path = ".".join(image.path.split(".")[:-1]) + ".png"
        img.save(png_path)
        return os.path.relpath(png_path, settings.MEDIA_ROOT)
    return image.name


class Author(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(utils.transliterate(self.name))
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField()

    def __str__(self):
        return self.name


class Book(models.Model):
    title = models.CharField(max_length=300)
    title_slug = models.SlugField(blank=True, null=True)
    description = models.TextField(blank=True, default="")
    book_image = models.ImageField(
        validators=[FileExtensionValidator(["jpeg", "jpg", "png", "webp"])],
        blank=True,
        null=True,
        upload_to=book_directory_path,
    )
    book_file = models.FileField(
        validators=[FileExtensionValidator(["pdf", "epub", "mobi", "doc", "docx"])],
        blank=True,
        null=True,
        upload_to=book_directory_path,
    )
    categories = models.ManyToManyField(Category)
    authors = models.ManyToManyField(Author)

    def save(self, *args, **kwargs):
        self.title_slug = slugify(utils.transliterate(self.title))
        self.book_image.upload_to = f"books/{self.title_slug}/"
        super().save(*args, **kwargs)

        if self.book_image:
            new_path = convert_to_png(self.book_image)
            self.book_image.name = new_path
            super().save(update_fields=["book_image"])
