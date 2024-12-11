"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

/**
 * チェックアウトページのナビゲーションを管理するカスタムフック
 * @returns {object} checkoutStep: 現在のチェックアウトステップ, navigateToStep: 指定したステップへ移動する関数
 */
export const useCheckoutNavigation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn } = useUser();

  // URLからコースIDを取得。存在しない場合は空文字列を設定
  const courseId = searchParams.get("id") ?? "";
  // URLからチェックアウトステップを取得。存在しない場合はデフォルトで1を設定
  const checkoutStep = parseInt(searchParams.get("step") ?? "1", 10);

  /**
   * 指定されたステップにナビゲートする関数
   * @param {number} step 移動先のステップ
   */
  const navigateToStep = useCallback(
    (step: number) => {
      // ステップが1から3の範囲内になるように調整
      const newStep = Math.min(Math.max(1, step), 3);
      // ユーザーがサインインしているかどうかに基づいてshowSignUpパラメータを設定
      const showSignUp = isSignedIn ? "true" : "false";

      // 指定されたステップとコースID、サインアップ状態をURLに含めてページを遷移
      router.push(
        `/checkout?step=${newStep}&id=${courseId}&showSignUp=${showSignUp}`,
        {
          scroll: false,
        }
      );
    },
    [courseId, isSignedIn, router]
  );

  // ユーザーがロード済みで、サインインしておらず、かつチェックアウトステップが1より大きい場合に、ステップ1にリダイレクトする
  useEffect(() => {
    if (isLoaded && !isSignedIn && checkoutStep > 1) {
      navigateToStep(1);
    }
  }, [isLoaded, isSignedIn, checkoutStep, navigateToStep]);

  return { checkoutStep, navigateToStep };
};
