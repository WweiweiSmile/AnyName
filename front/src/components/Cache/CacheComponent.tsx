import React, { Key, ReactNode, useContext, useEffect, useRef } from "react";
import { CacheContainerContext } from "./CacheContainer";

interface CacheComponentProps {
  children: ReactNode;
  onlyKey: Key;
}
const CacheComponent: React.FC<CacheComponentProps> = (props) => {
  // const { children, onlyKey } = props;
  // const { appendElement, getElement } = useContext(CacheContainerContext);
  // const ref = useRef<HTMLDivElement>(null)
  // const cacheContent = getElement(onlyKey);
  // const content = <div key={}>{cacheContent || children}</div>
  // useEffect(() => {
  //   return () => {
  //     appendElement(onlyKey, content);
  //   };
  // }, []);
  // console.log("key->", onlyKey);

  // return {content} ;
  return <></>
};

export default CacheComponent;
