import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HotUpdateManager')
export default class HotUpdateManager extends Component {
    @property(String)
    remoteManifestUrl: string = '';

    @property(String)
    remotePackageUrl: string = '';

    private storagePath: string;

    onLoad() {
        this.storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'hotupdate_assets';

        cc.assetManager.downloader.remoteManifestUrl = this.remoteManifestUrl;
        cc.assetManager.downloader.remoteVersionUrl = this.remotePackageUrl;
        cc.assetManager.downloader.maxConcurrency = 2;

        if (cc.sys.isNative) {
            cc.assetManager.init({
                version: '1.0',
                bundleVers: {}
            });

            this.checkForUpdate();
        }
    }

    checkForUpdate() {
        if (!cc.sys.isNative) {
            return;
        }

        let versionCompareHandle = function (versionA: string, versionB: string): number {
            return cc.compareVersion(versionA, versionB);
        };

        cc.assetManager.setVersionCompareHandle(versionCompareHandle);

        cc.assetManager.loadRemoteManifest(this.remoteManifestUrl, (err, manifest) => {
            if (err) {
                console.error('Error loading remote manifest: ' + err);
            } else {
                this._am = new jsb.AssetsManager('', this.storagePath, versionCompareHandle);
                this._am.loadLocalManifest(manifest, this.storagePath);

                this._am.setEventCallback(this.checkCb.bind(this));
                this._am.checkUpdate();
            }
        });
    }

    checkCb(event: jsb.EventAssetsManager) {
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log('No local manifest file found, hot update skipped.');
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.error('Fail to download manifest file, hot update skipped.');
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log('Already up to date with the latest remote version.');
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                console.log('New version found, please try to update.');
                this.hotUpdate();
                break;
            default:
                break;
        }
    }

    hotUpdate() {
        if (this._am && !this._updating) {
            this._am.setEventCallback(this.updateCb.bind(this));
            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                this._am.loadLocalManifest(this.remoteManifestUrl);
            }

            this._failCount = 0;
            this._updating = true;
            this._am.update();
        }
    }

    updateCb(event: jsb.EventAssetsManager) {
        var needRestart = false;
        var failed = false;

        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log('No local manifest file found, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                console.log(
                    'HotUpdate: ' + event.getPercent() + '% | ' + event.getDownloadedFiles() + ' / ' + event.getTotalFiles()
                );
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.error('Fail to download manifest file, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log('Already up to date with the latest remote version.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                console.log('Update finished. ' + event.getMessage());
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                console.error('Update failed. ' + event.getMessage());

                this._failCount++;
                if (this._failCount <= 3) {
                    this._am.downloadFailedAssets();
                } else {
                    console.error('Reach maximum fail count, exit update process.');
                    this._failCount = 0;
                    failed = true;
                }
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                console.error('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                console.error(event.getMessage());
                break;
            default:
                break;
        }

        if (failed) {
            this._am.setEventCallback(null);
            this._updating = false;
        }

        if (needRestart) {
            this._am.setEventCallback(null);
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            Array.prototype.unshift.apply(searchPaths, newPaths);
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            cc.game.restart();
        }
    }
}
