# functions-sample

## 使用前に

.firebaserc のプロジェクトIDは空にしてあるので埋める必要がある。

## deploy

## 初回デプロイ前の準備
サービスアカウントを作成し、サービスアカウントキー（json）を作成する。

その json を base64 encode した文字列を GitHub Actions の Secrets に `DEV_GOOGLE_APPLICATION_CREDENTIALS` という名称で登録する。

デプロイを成功させるためにデプロイを行うサービスアカウントの IAM に幾つかのロールを付与する必要がある。最終的に

- Eventarc 管理者
- Project IAM 管理者
- 編集者

を付与してデプロイに成功したが、これが過剰でないかは不明。

## デプロイ後

```
functions: Unhandled error cleaning up build images. This could result in a small monthly bill if not corrected. You can attempt to delete these images by redeploying or you can delete them manually at ...
```

という warning が出ることがある。warning が出たら手動でキャッシュを削除しなければいけない場合がある。
