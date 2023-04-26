exports.ReactClient = (function () {

    const { KakaoTalkConfig } = require('../config');
    const { RequestClient } = require('../request');

    /**
     * @param { number } userId
     * @param { AuthorizeConfig } authorizeConfig
     * @param { AllConfig } config
     */
    function ReactClient(
        userId,
        authorizeConfig,
        config
    ) {
        this.userId = userId;
        this.authorization = authorizeConfig.accessToken + '-' + authorizeConfig.deviceUUID;
        this.config = config;
        this.client = new RequestClient('talk-pilsner.kakao.com');
    }

    /**
     * add react to message
     * @param { number | string | bigint } channelId
     * @param { string | number | bigint } logId
     * @param { number } type
     * @param { [number] | [string] | [bigint]? } linkId
     */
    ReactClient.prototype.react = function (channelId, logId, type, linkId) {
        return JSON.parse(
            this.client.request(
                'POST',
                '/messaging/chats/' + channelId + '/bubble/reactions',
                JSON.stringify({
                    logId: logId,
                    reqId: Date.now(),
                    type: type,
                    linkId: linkId
                }),
                this.generateHeader()
            ).body()
        )
    }

    /**
     * sync
     * @param { number | string | bigint } channelId
     * @param { number | string | bigint } start
     * @param { number | string | bigint } end
     */
    ReactClient.prototype.sync = function (channelId, start, end) {
        return JSON.parse(
            this.client.request(
                'GET',
                '/messaging/chats/' + channelId + '/bubble/sync-meta',
                {
                    cur: start,
                    max: end,
                    cnt: 0
                },
                this.generateHeader()
            ).body()
        )
    }

    /**
     * members
     * @param { number | string | bigint } channelId
     * @param { number | string | bigint } logId
     */
    ReactClient.prototype.member = function (channelId, logId) {
        return JSON.parse(
            this.client.request(
                'GET',
                '/messaging/chats/' + channelId + '/bubble/reactions/' + logId + '/members',
                {},
                this.generateHeader()
            ).body()
        )
    }

    ReactClient.prototype.generateHeader = function () {
        const headers = {};

        headers['Authorization'] = this.authorization;
        headers['talk-agent'] = 'android/' + this.config.version;
        headers['talk-language'] = 'ko';
        headers['Content-Type'] = 'application/json; charset=UTF-8';
        headers['User-Agent'] = 'okhttp/' + this.config.okhttpVersion;

        return headers;
    }

    /**
     * @param { number } userId
     * @param { AuthorizeConfig } authorizeConfig
     * @param { AllConfig? } config
     */
    ReactClient.create = function (
        userId,
        authorizeConfig,
        config
    ) {
        return new ReactClient(
            userId,
            authorizeConfig,
            Object.assign(
                JSON.parse(JSON.stringify(KakaoTalkConfig)),
                config
            )
        );
    }

    return ReactClient;

})()