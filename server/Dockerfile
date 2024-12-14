# Dockerfileの解説

# 1. ビルドステージの定義
#    - ベースイメージとして、AWS Lambda Node.js 20のイメージを使用します。
#    - このイメージは、アプリケーションのビルドに必要なツールと環境を提供します。
#    - `as build` は、このステージに `build` という名前を付けます。
FROM public.ecr.aws/lambda/nodejs:20 As build

# 2. 作業ディレクトリの設定
#    - コンテナ内の作業ディレクトリを `/app` に設定します。
#    - 以降のコマンドは、このディレクトリを基準に実行されます。
WORKDIR /app

# 3. package.json ファイルのコピー
#    - `package*.json` ファイル（`package.json` と `package-lock.json`）を現在のディレクトリ（`/app`）にコピーします。
#    - これにより、npm install で依存関係をインストールする準備が整います。
COPY package*.json ./

# 4. 依存関係のインストール
#    - `npm install` を実行して、`package.json` に記述された依存関係をインストールします。
#    - これにより、アプリケーションの実行に必要なライブラリが揃います。
RUN npm install

# 5. プロジェクトファイルのコピー
#    - プロジェクトのすべてのファイルを現在のディレクトリ（`/app`）にコピーします。
#    - これにより、アプリケーションのソースコードがコンテナ内に配置されます。
COPY . .

# 6. アプリケーションのビルド
#    - `npm run build` を実行して、アプリケーションをビルドします。
#    - このコマンドは、`package.json` の `scripts` セクションで定義されたビルドプロセスを実行します。
#    - 通常、TypeScriptのコンパイルやJavaScriptのバンドルなどが行われます。
RUN npm run build

# 7. 本番環境用依存関係の整理
#    - `npm prune --production` を実行して、本番環境で使用しない開発用の依存関係を削除します。
#    - これにより、最終的なイメージサイズを小さくすることができます。
RUN npm prune --production

# 8. ランタイムステージの定義
#    - 別のベースイメージとして、AWS Lambda Node.js 20のイメージを使用します。
#    - このイメージは、アプリケーションの実行に必要な最小限の環境を提供します。
FROM public.ecr.aws/lambda/nodejs:20

# 9. 作業ディレクトリの設定（ランタイム）
#    - コンテナ内の作業ディレクトリを Lambda のタスクルート（`${LAMBDA_TASK_ROOT}`）に設定します。
#    - Lambda環境では、この環境変数が実行ディレクトリを指します。
WORKDIR ${LAMBDA_TASK_ROOT}

# 10. ビルド済みアプリケーションのコピー
#     - ビルドステージ（`build`）から `/app/dist` ディレクトリを Lambda のタスクルートにコピーします。
#     - これにより、ビルドされたアプリケーションがランタイム環境に配置されます。
COPY --from=build /app/dist ${LAMBDA_TASK_ROOT}
# 11. node_modulesのコピー
#     - ビルドステージ（`build`）から `/app/node_modules` ディレクトリを Lambda のタスクルートにコピーします。
#     - これにより、必要な依存関係がランタイム環境に配置されます。
COPY --from=build /app/node_modules ${LAMBDA_TASK_ROOT}/node_modules

# 12. package.json ファイルのコピー（ランタイム）
#     - ビルドステージ（`build`）から `package*.json` ファイルを Lambda のタスクルートにコピーします。
#     - これは、ランタイム環境で必要な場合に備えてコピーします。
COPY --from=build /app/package*.json ${LAMBDA_TASK_ROOT}

# 13. 環境変数の設定
#     - 環境変数 `NODE_ENV` を `production` に設定します。
#     - これにより、アプリケーションが本番環境として動作するように設定されます。
ENV NODE_ENV=production

# 14. Lambdaハンドラーの設定
#     - Lambda関数のハンドラーを `index.handler` に設定します。
#     - これは、Lambda関数が実行される際に最初に呼び出される関数を指定します。
CMD ["index.handler"]