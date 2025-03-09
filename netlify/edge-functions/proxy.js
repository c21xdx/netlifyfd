// deno-lint-ignore-file no-unused-vars
import { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);

  if (request.method === 'GET') {
    return new Response("Hello, world!", {
      headers: { "content-type": "text/plain" },
    });
  } else if (request.method === 'POST') {
    try {
      const body = await request.text(); // 读取原始请求体

      const fetchOptions = {
        method: 'POST',
        body: body, // 传递原始请求体
        headers: request.headers, // 转发所有 headers
      };

      // 修改 Host header，防止目标服务器返回 400 Bad Request
      // 因为目标网站使用IP地址，不需要设置HOST
      //fetchOptions.headers.set('Host', '129.146.244.132');

      const response = await fetch('http://129.146.244.132:8085/xblog', fetchOptions);
      const text = await response.text(); // 读取响应体

      const headers = new Headers(response.headers);
      // 移除 "transfer-encoding": "chunked" 头,防止客户端解析错误
      headers.delete("transfer-encoding");

      return new Response(text, {
        status: response.status,
        headers: headers, // 转发所有响应 headers
      });
    } catch (error) {
      console.error("Proxy error:", error);
      return new Response("Proxy error", { status: 500 });
    }
  } else {
    return new Response("Method not allowed", { status: 405 });
  }
};

export const config = { path: "/*" };
