# AWS Lambda Node.js 20のベースイメージをビルドステージとして使用
# これにより、必要なツールとライブラリが揃った環境でアプリケーションをビルドできます
FROM public.ecr.aws/lambda/nodejs:20 AS build

# コンテナ内の作業ディレクトリを/appに設定
# ここにアプリケーションのソースコードと依存関係が配置されます
WORKDIR /app

# package.jsonとpackage-lock.jsonを現在のディレクトリにコピー
# これにより、npm installが依存関係をインストールする際にこれらのファイルを利用できます
COPY package*.json ./

# npm installを実行して、package.jsonに記載された依存関係をインストール
# ビルドに必要な開発依存関係もインストールされます
RUN npm install

# アプリケーションのソースコード全体をコンテナの/appディレクトリにコピー
# これにより、ビルドプロセスでソースコードを利用できます
COPY . .

# TypeScriptファイルをJavaScriptファイルにコンパイル
# npm run buildは、tsconfig.jsonの設定に基づいてTypeScriptファイルをビルドします
RUN npm run build

# 本番環境では不要な開発依存関係を削除
# これにより、最終的なイメージサイズを小さくします
RUN npm prune --production

# 本番環境用のイメージを準備するための第二段階
# ビルドステージで作成された成果物のみを含めることで、イメージサイズを最適化します
FROM public.ecr.aws/lambda/nodejs:20

# Lambda関数の実行時に使用される作業ディレクトリを設定
# LAMBDA_TASK_ROOTはLambda環境で自動的に設定される環境変数です
WORKDIR ${LAMBDA_TASK_ROOT}

# ビルドステージからビルドされたJavaScriptファイル（/app/dist）をLambdaの作業ディレクトリにコピー
# これにより、Lambda関数が実行時に必要なコードを利用できます
COPY --from=build /app/dist ${LAMBDA_TASK_ROOT}

# ビルドステージからnode_modulesディレクトリをLambdaの作業ディレクトリにコピー
# これにより、Lambda関数が実行時に必要な依存関係を利用できます
COPY --from=build /app/node_modules ${LAMBDA_TASK_ROOT}/node_modules

# ビルドステージからpackage.jsonをLambdaの作業ディレクトリにコピー (オプション)
# これは、Lambda関数が実行時にpackage.jsonを必要とする場合に役立ちます
COPY --from=build /app/package*.json ${LAMBDA_TASK_ROOT}

# 環境変数を設定
# NODE_ENV=productionを設定することで、本番環境向けの最適化が有効になります
ENV NODE_ENV=production

# Lambda関数を開始するコマンドを設定
# index.handlerは、Lambda関数のエントリポイントとなるハンドラー関数を指定します
CMD ["index.handler"]