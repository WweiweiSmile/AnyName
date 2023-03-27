import React, { createContext, Key, ReactNode, useRef, useState } from "react";

interface CacheContainerProps {
  children: ReactNode;
}

interface CacheContainerContext {
  // elements: Record<Key, ReactNode>;
  getElement: (key: Key) => React.Ref<HTMLDivElement>;
  appendElement: (key: Key, ref: React.Ref<HTMLDivElement>) => void;
}
export const CacheContainerContext = createContext<CacheContainerContext>({
  getElement: () => null,
  appendElement: () => null,
});

const CacheContainer: React.FC<CacheContainerProps> = (props) => {
  return <></>
  const { children } = props;
  const ref = useRef<HTMLDivElement>(null);
  const appendElement: CacheContainerContext["appendElement"] = (
    key,
    ref:React.Ref<HTMLDivElement>
  ) => {};
  const getElement: CacheContainerContext["getElement"] = (key) => {
    return null
  };
  return (
    <CacheContainerContext.Provider value={{ appendElement, getElement }}>
      {children}
      <div
        ref={ref}
        style={{
          position: "absolute",
          zIndex: "0",
          height: 0,
          width: 0,
          overflow: "hidden",
        }}
      ></div>
    </CacheContainerContext.Provider>
  );
};

export default CacheContainer;
