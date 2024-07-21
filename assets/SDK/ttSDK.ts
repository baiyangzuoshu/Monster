import { iSDK } from "./iSDK";


declare var tt: any;

export class ttSDK implements iSDK {
    public  login(){
        console.log('ttSDK login');
        tt.login({
            force: true,
            success(_res) {
                console.log("登录成功");
                // 调用 getUserInfo 前, 请确保登录成功
                //ttSDK.openSetting();
                // 获取用户信息
                tt.getUserInfo({
                    withCredentials: true,
                    withRealNameAuthenticationInfo: true,
                    success(res) {
                        console.log(`getUserInfo 调用成功`, res.userInfo);
                    },
                    fail(res) {
                        console.log(`getUserInfo 调用失败`, res.errMsg);
                    },
                });
            },
            fail(res) {
                console.log("登录失败", res.errMsg);
            },
        });
    }

    public  getSetting(){
        tt.getSetting({
            success(res) {
              console.log("getSetting ",res);
            },
            fail(res) {
              console.log(`getSetting 调用失败`);
            },
          });
    }

    public  openSetting(){
        tt.openSetting({
            success(res) {
              console.log("openSetting",res);
            },
            fail(res) {
              console.log(`openSetting 调用失败`);
            },
          });
    }

    public  checkUpdate(){
        const updateManager = tt.getUpdateManager();
        updateManager.onCheckForUpdate((res) => {
            // 请求完新版本信息的回调
            if (!res.hasUpdate) {
              console.log("当前版本已经是最新版本");
              this.login();
            }
          });

        updateManager.onUpdateReady((res) => {
            tt.showModal({
                title: "更新提示",
                content: "新版本已经准备好，是否重启小游戏？",
                success: (res) => {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate();
                    }
                },
            });
        });

        updateManager.onUpdateFailed((err) => {
            // 新的版本下载失败
            console.log("版本下载失败原因", err);
            tt.showToast({
                title: "新版本下载失败，请稍后再试",
                icon: "none",
            });
        });

        this.onRealNameAuthenticationComplete();
    }

    public  authenticateRealName(){
        //实名认证需要用户点击触发
        tt.onTouchEnd(realNameAuth);

        function realNameAuth() {
            tt.authenticateRealName({
              success(_res) {
                console.log("用户实名认证成功");
              },
              fail(res) {
                console.log("用户实名认证失败", res.errMsg);
              },
            });
          }
    }

    public  onRealNameAuthenticationComplete(){
        tt.onRealNameAuthenticationComplete(function (obj) {
            console.log("实名认证完成回调 ", obj);
        });
    }
}


