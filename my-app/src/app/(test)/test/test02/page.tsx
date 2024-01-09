"use client";

import React from 'react'
import { createEditor } from './dataFlow';
import { useRete } from "rete-react-plugin";

const Page = () => {
  const [ref] = useRete(createEditor);

  return (
    <>
      <div ref={ref} style={{ height: "100vh", width: "100vw" }}></div>
    </>
  );
};

export default Page;