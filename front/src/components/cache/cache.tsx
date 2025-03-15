import React, {Key, ReactNode, useContext, useEffect, useRef} from 'react';
import {CacheContainerContext} from './with_cache';

interface CacheComponentProps {
  children: ReactNode;
  onlyKey: Key;
}

const Cache: React.FC<CacheComponentProps> = (props) => {
  const {children, onlyKey} = props;
  const {state, appendElement} = useContext(CacheContainerContext);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cacheContent = state[onlyKey];
    // 如果没有 状态 或者 缓存的组件被销毁了，创建新的缓存组件
    if (!cacheContent?.status || cacheContent?.status === 'destory') {
      appendElement(onlyKey, children);
    }
    // 如果组件已经被缓存了，直接使用
    if (ref.current && cacheContent?.status === 'created') {
      const doms = [...cacheContent.doms];
      ref.current.append(...doms);
    }
  }, [state]);

  return <div id={onlyKey.toString()} ref={ref}></div>;
};

export default Cache;
