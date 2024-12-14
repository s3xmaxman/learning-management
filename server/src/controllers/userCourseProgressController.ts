import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import UserCourseProgress from "../models/userCourseProgressModel";
import Course from "../models/courseModel";
import { calculateOverallProgress } from "../utils/utils";
import { mergeSections } from "../utils/utils";

/**
 * ユーザーが登録しているコースをすべて取得します。
 *
 * @param req Expressリクエストオブジェクト
 * @param res Expressレスポンスオブジェクト
 * @returns 登録済みコースのリスト
 */
export const getUserEnrolledCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const auth = getAuth(req);

  if (!auth || !auth.userId) {
    res.status(403).json({ message: "Access denied" });
    return;
  }

  try {
    const enrolledCourses = await UserCourseProgress.query("userId")
      .eq(userId)
      .exec();

    const courseIds = enrolledCourses.map((course) => course.courseId);
    const courses = await Course.batchGet(courseIds);

    res.json({
      message: "User enrolled courses retrieved successfully",
      data: courses,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving user enrolled courses", error });
  }
};

/**
 * 特定のユーザーの特定のコースの進捗状況を取得します。
 *
 * @param req Expressリクエストオブジェクト
 * @param res Expressレスポンスオブジェクト
 * @returns コースの進捗状況
 */
export const getUserCourseProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, courseId } = req.params;

  try {
    const progress = await UserCourseProgress.get({ userId, courseId });

    if (!progress) {
      res.status(404).json({ message: "User course progress not found" });
      return;
    }

    res.json({
      message: "User course progress retrieved successfully",
      data: progress,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving user course progress", error });
  }
};

/**
 * ユーザーのコース進捗状況を更新します。
 *
 * @param req Expressリクエストオブジェクト
 * @param res Expressレスポンスオブジェクト
 * @returns 更新されたコース進捗状況
 */
export const updateUserCourseProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, courseId } = req.params;
  const progressData = req.body;

  try {
    let progress = await UserCourseProgress.get({ userId, courseId });

    if (!progress) {
      progress = new UserCourseProgress({
        userId,
        courseId,
        enrollmentDate: new Date().toISOString(),
        overallProgress: 0,
        sections: progressData.sections || [],
        lastAccessedTimestamp: new Date().toISOString(),
      });
    } else {
      progress.sections = mergeSections(
        progress.sections,
        progressData.sections || []
      );
      progress.lastAccessedTimestamp = new Date().toISOString();
      progress.overallProgress = calculateOverallProgress(progress.sections);
    }

    await progress.save();

    res.json({
      message: "",
      data: progress,
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({
      message: "Error updating user course progress",
      error,
    });
  }
};
