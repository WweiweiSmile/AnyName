import React, {createContext, Key, ReactNode, useRef, useState} from 'react';

interface CacheContainerProps {
  children: ReactNode;
}

type CacheStatus = "create" | "created" | "destory";
interface CacheComponent {
  key: Key;
  children: ReactNode;
  doms: ChildNode[];
  status: CacheStatus;
}

interface _CacheContainerContext {
  state: Record<string, CacheComponent>;
  appendElement: (key: Key, element: ReactNode) => void;
}

export const CacheContainerContext = createContext<_CacheContainerContext>({
  state: {},
  appendElement: (key, element) => {
    console.log(key, element);
  },
});

const WithCache: React.FC<CacheContainerProps> = (props) => {
  const { children } = props;
  const [cacheElement, setCacheElement] = useState<
    Record<string, CacheComponent>
  >({});
  const cacheRef = useRef<HTMLDivElement>(null);

  // 保存 缓存组件方法
  const setCacheElementFn = (
    key: Key,
    element: CacheComponent,
    log?: string
  ) => {
    console.log("setCacheElementFn", log, "->", key, element);
    setCacheElement({
      ...cacheElement,
      [key]: element,
    });
  };

  // 添加 缓存组件
  const appendElement: _CacheContainerContext["appendElement"] = (
    key,
    element
  ) => {
    const cacheComponent: CacheComponent = {
      key: key,
      status: "create",
      doms: [],
      children: element,
    };
    // 如果缓存的组件没有被创建
    if (cacheElement[key]?.status !== "created") {
      setCacheElementFn(key, cacheComponent, "添加children");
    }
  };

  return (
    <CacheContainerContext.Provider
      value={{
        state: cacheElement,
        appendElement,
      }}
    >
      <div id="CacheContainer" ref={cacheRef}>
        <div id="CacheContainerContent">{children}</div>
        <div
          id={"cache"}
          style={{ width: "0px", height: "0px", overflow: "hidden" }}
        >
          {Object.keys(cacheElement).map((key) => {
            const reactNode = cacheElement[key].children;
            return (
              <div
                id={"Cache-" + key}
                ref={(ref) => {
                  const nodes: ChildNode[] = [];
                  ref?.childNodes.forEach((node) => nodes.push(node));

                  const cacheComponent = cacheElement[key];
                  // 如果组件渲染了，并且组件并没在缓存中
                  if (ref && cacheComponent.status !== "created") {
                    setCacheElementFn(
                      key,
                      {
                        ...cacheComponent,
                        doms: nodes,
                        status: "created",
                      },
                      "实例渲染完成"
                    );
                  }
                }}
                key={key}
              >
                {reactNode}
              </div>
            );
          })}
        </div>
      </div>
    </CacheContainerContext.Provider>
  );
};

export default WithCache;
