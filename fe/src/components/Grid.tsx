import { css, styled } from "solid-styled-components";

type AlignItems = "start" | "end" | "center" | "stretch" | "baseline";
type JustifyContent =
  | "start"
  | "end"
  | "center"
  | "space-between"
  | "space-around";
type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";

export const Row = styled("div")<{
  gutter?: number;
  align?: AlignItems;
  justify?: JustifyContent;
  direction?: FlexDirection;
}>`
  display: flex;
  flex-wrap: wrap;
  margin-left: ${(props) => (props.gutter ? (props.gutter / 2) * -1 : "0")}px;
  margin-right: ${(props) => (props.gutter ? (props.gutter / 2) * -1 : "0")}px;
  --gutter: ${(props) => (props.gutter ? props.gutter : "0")}px;
  align-items: ${(props) => (props.align ? props.align : "stretch")};
  justify-content: ${(props) => (props.justify ? props.justify : "start")};
  flex-direction: ${(props) => (props.direction ? props.direction : "row")};
`;
type Size = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export const Col = styled("div")<{
  size?: Size;
  sm?: Size;
  md?: Size;
  lg?: Size;
}>`
  padding-bottom: var(--gutter);
  padding-left: calc(var(--gutter) / 2);
  padding-right: calc(var(--gutter) / 2);
  width: 100%;
  max-width: ${(props) =>
    props.size ? (props.size / 12) * 100 + "%" : "100%"};
  @media only screen and (max-width: 576px) {
    max-width: ${(props) =>
      props.sm ? (props.sm / 12) * 100 + "%" : "inherit"};
  }
  @media only screen and (max-width: 992px) {
    max-width: ${(props) =>
      props.md ? (props.md / 12) * 100 + "%" : "inherit"};
  }
  @media only screen and (max-width: 1280px) {
    max-width: ${(props) =>
      props.lg ? (props.lg / 12) * 100 + "%" : "inherit"};
  }
`;
