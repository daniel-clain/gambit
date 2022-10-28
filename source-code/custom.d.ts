declare module "*.png";
declare module "*.jpg";

interface Elem extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>{
  name?: string
  readonly?: boolean
  class?: string
  [propName: string] : any;
}
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string] : Elem;
  }
}