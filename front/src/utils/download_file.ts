export function downloadFile(url: string, filename: string) {
  // 创建一个隐藏的 <a> 元素
  const a = document.createElement("a");
  a.style.display = "none";

  // 设置链接地址和 download 属性
  a.href = url;
  a.download = filename;
  a.target = "_blank";
  a.rel = "noopener noreferrer";

  // 触发点击事件进行下载
  document.body.appendChild(a);
  a.click();

  // 移除元素
  document.body.removeChild(a);
}
