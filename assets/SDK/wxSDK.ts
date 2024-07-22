import { iSDK } from "./iSDK";

declare let wx:any;

export class wxSDK implements iSDK {
    public login(){
        const self=this;
        wx.login({
            success (res) {
              if (res.code) {
                // 发起网络请求
                console.log('登录成功！' + JSON.stringify(res))

                self.getSetting();
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
        })
    }

    public getSetting(){
        wx.getSetting({
            success(res) {
              if (res.authSetting['scope.userInfo'] === true) {
                wx.getUserInfo({
                  success: (res) => {
                    // 已经授权，直接获取用户信息
                    console.log('已经授权，直接获取用户信息',res);
                  },
                });
              } else {
                const button = wx.createUserInfoButton({
                  type: "image",
                  style: {
                    left: 100,
                    top: 100,
                    width: 100,
                    height: 100,
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                  },
                });
                button.onTap((res) => {
                  if (res.errMsg.indexOf(':ok') > -1 && !!res.rawData) {
                    // 获取用户信息
                    console.log('获取用户信息',res);
                  }
                });
              }
            },
          });
    }

    public openSetting(){}

    public checkUpdate(){
        const updateManager = wx.getUpdateManager()
        const self=this;
        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            console.log('请求完新版本信息的回调',res.hasUpdate)
            if(res.hasUpdate){
                return;
            }

            const version = wx.getAppBaseInfo().SDKVersion
            const target= '3.3.0';
            console.log('SDKVersion',version);
            if (self.compareVersion(version, target) >= 0) {
                wx.startGyroscope()

                self.login();
            } else {
                // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
                wx.showModal({
                    title: '提示',
                    content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
                })

            }
        })

        updateManager.onUpdateReady(function () {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success(res) {
                if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate()
                }
                }
            })
        })

        updateManager.onUpdateFailed(function () {
            // 新版本下载失败
            console.error('新版本下载失败');
        })
    }

    public authenticateRealName(){}

    public onRealNameAuthenticationComplete(){}

    private compareVersion(v1, v2):number {
        v1 = v1.split('.')
        v2 = v2.split('.')
        const len = Math.max(v1.length, v2.length)
      
        while (v1.length < len) {
          v1.push('0')
        }
        while (v2.length < len) {
          v2.push('0')
        }
      
        for (let i = 0; i < len; i++) {
          const num1 = parseInt(v1[i])
          const num2 = parseInt(v2[i])
      
          if (num1 > num2) {
            return 1
          } else if (num1 < num2) {
            return -1
          }
        }
      
        return 0
      }
}


