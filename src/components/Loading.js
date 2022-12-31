import React from "react";
import ReactLoading from "react-loading";
import { Section, Title, Article, Prop, list } from "./Generic";

export default function Loading() {
  return (
    <>
    <Section>
        <ReactLoading
          type={"bars"}
          color={"#DFAF5B"}
          height={100}
          width={100}
        />
    </Section>
    </>
)};