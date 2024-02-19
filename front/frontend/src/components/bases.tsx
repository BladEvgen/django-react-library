import * as footers from "./footers";
import * as navbars from "./navbars";

export function Base1({ children }: any) {
  return (
    <main className={"container text-bg-dark text-white custom-main "}>
      <navbars.Navbar1 />
      <div>{children}</div>
      <footers.Footer1 />
    </main>
  );
}

export function Base2({ children }: any) {
  return (
    <main className={"container-fluid text-bg-dark text-white custom-main "}>
      <navbars.Navbar1 />

      <div>{children}</div>
      <footers.Footer1 />
    </main>
  );
}
