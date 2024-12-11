import { useState } from "react";
import { useParams } from "next/navigation";
import {
  useGetCourseQuery,
  useGetUserCourseProgressQuery,
  useUpdateUserCourseProgressMutation,
} from "@/state/api";
import { useUser } from "@clerk/nextjs";

/**
 * コースの進捗データを管理するためのカスタムフック
 * @returns コースの進捗データと関連する関数
 */
export const useCourseProgressData = () => {
  // URLパラメータからコースIDとチャプターIDを取得
  const { courseId, chapterId } = useParams();
  // Clerkからユーザー情報を取得
  const { user, isLoaded } = useUser();
  // チャプターを完了としてマークしたかどうかを管理するステート
  const [hasMarkedComplete, setHasMarkedComplete] = useState(false);
  // ユーザーのコース進捗を更新するためのミューテーション
  const [updateProgress] = useUpdateUserCourseProgressMutation();

  // コースデータを取得するためのクエリ
  const { data: course, isLoading: courseLoading } = useGetCourseQuery(
    (courseId as string) ?? "",
    {
      skip: !courseId,
    }
  );

  // ユーザーのコース進捗データを取得するためのクエリ
  const { data: userProgress, isLoading: progressLoading } =
    useGetUserCourseProgressQuery(
      {
        userId: user?.id ?? "",
        courseId: (courseId as string) ?? "",
      },
      {
        skip: !isLoaded || !user || !courseId,
      }
    );

  // データの読み込み中かどうかを判定
  const isLoading = !isLoaded || courseLoading || progressLoading;

  // 現在のセクションを取得
  const currentSection = course?.sections.find((s) =>
    s.chapters.some((c) => c.chapterId === chapterId)
  );

  // 現在のチャプターを取得
  const currentChapter = currentSection?.chapters.find(
    (c) => c.chapterId === chapterId
  );

  /**
   * 現在のチャプターが完了しているかどうかを確認する関数
   * @returns 現在のチャプターが完了している場合はtrue、そうでない場合はfalse
   */
  const isChapterCompleted = () => {
    if (!currentSection || !currentChapter || !userProgress?.sections)
      return false;

    const section = userProgress.sections.find(
      (s) => s.sectionId === currentSection.sectionId
    );
    return (
      section?.chapters.some(
        (c) => c.chapterId === currentChapter.chapterId && c.completed
      ) ?? false
    );
  };

  /**
   * チャプターの進捗を更新する関数
   * @param sectionId セクションID
   * @param chapterId チャプターID
   * @param completed 完了したかどうか
   */
  const updateChapterProgress = (
    sectionId: string,
    chapterId: string,
    completed: boolean
  ) => {
    if (!user) return;

    const updatedSections = [
      {
        sectionId,
        chapters: [
          {
            chapterId,
            completed,
          },
        ],
      },
    ];

    updateProgress({
      userId: user.id,
      courseId: (courseId as string) ?? "",
      progressData: {
        sections: updatedSections,
      },
    });
  };

  return {
    user,
    courseId,
    chapterId,
    course,
    userProgress,
    currentSection,
    currentChapter,
    isLoading,
    isChapterCompleted,
    updateChapterProgress,
    hasMarkedComplete,
    setHasMarkedComplete,
  };
};
