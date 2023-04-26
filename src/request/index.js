/**
 * MIT License
 *
 * Copyright (c) 2022 naijun
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * HTTP Request Client
 * @author naijun
 */
exports.RequestClient = /** @class */ (function () {
    const qs = require('../module/qs')

    function RequestClient(host) {
        this.host = host;
    }

    RequestClient.prototype.changeHost = function (host) {
        this.host = host;
    }

    /**
     * request
     * @param method { string }
     * @param path { string }
     * @param data { Record<string, unknown> | string }
     * @param headers { Record<string, string> }
     * @param followRedirect { boolean? }
     * @return {{body(): string;statusCode(): number;cookies():{putAll(obj: unknown);};url():{toExternalForm():string};parse():{select(query: string): {attr(str: string): string}; getElementById(id: string): { data(): string; }}}}
     */
    RequestClient.prototype.request = function (
        method,
        path,
        data,
        headers,
        followRedirect
    ) {
        try {
            method = method || 'GET';
            path = path || '/';
            data = data || {};
            headers = headers || {};
            followRedirect = followRedirect || false

            method = org.jsoup.Connection.Method[method.toUpperCase()];

            let request = null;

            if (method === org.jsoup.Connection.Method['GET']) {
                if (Object.keys(data).length === 0) {
                    request = org.jsoup.Jsoup.connect('https://' + this.host + path)
                } else {
                    request = org.jsoup.Jsoup.connect('https://' + this.host + path + '/?' + qs.stringify(data))
                }
            } else {
                request = org.jsoup.Jsoup.connect('https://' + this.host + path).method(method);

                if (typeof data === "string") request.requestBody(data);
                else {
                    const str = qs.stringify(data);
                    request.requestBody(str);
                }
            }

            Object.keys(headers).forEach(e => {
                request.header(e, headers[e]);
            }); // https://github.com/mozilla/rhino/issues/247

            request.header('Host', this.host);

            return request
                .ignoreContentType(true)
                .ignoreHttpErrors(true)
                .followRedirects(followRedirect)
                .execute();
        } catch (e) {
            throw e;
        }
    }

    return RequestClient;
})();