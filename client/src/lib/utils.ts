import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as z from "zod";
import { api } from "@/state/api";
import { toast } from "sonner";

/**
 * `clsx` と `tailwind-merge` を組み合わせて、クラス名を結合するためのユーティリティ関数です。
 * @param inputs - クラス名の配列
 * @returns 結合されたクラス名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * セントをフォーマットされた通貨文字列に変換します (例: 4999 -> "$49.99")。
 * @param cents - セント単位の金額
 * @returns フォーマットされた通貨文字列
 */
export function formatPrice(cents: number | undefined): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format((cents || 0) / 100);
}

/**
 * ドルをセントに変換します (例: "49.99" -> 4999)。
 * @param dollars - ドル単位の金額 (文字列または数値)
 * @returns セント単位の金額
 */
export function dollarsToCents(dollars: string | number): number {
  const amount = typeof dollars === "string" ? parseFloat(dollars) : dollars;
  return Math.round(amount * 100);
}

/**
 * セントをドルに変換します (例: 4999 -> "49.99")。
 * @param cents - セント単位の金額
 * @returns ドル単位の金額 (文字列)
 */
export function centsToDollars(cents: number | undefined): string {
  return ((cents || 0) / 100).toString();
}

/**
 * 価格入力用の Zod スキーマです。ドル入力をセントに変換します。
 * @example
 * priceSchema.parse("49.99") // returns "4999"
 */
export const priceSchema = z.string().transform((val) => {
  const dollars = parseFloat(val);
  if (isNaN(dollars)) return "0";
  return dollarsToCents(dollars).toString();
});

/**
 * 国名の配列です。
 */
export const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Congo-Brazzaville)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor (Timor-Leste)",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar (formerly Burma)",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

/**
 * カスタムスタイルを定義するための定数です。
 */
export const customStyles = "text-gray-300 placeholder:text-gray-500";

/**
 * 金額を補助通貨単位に変換します。
 * @param amount - 変換する金額
 * @param factor - 乗数 (デフォルトは 100)
 * @returns 補助通貨単位に変換された金額
 */
export function convertToSubCurrency(amount: number, factor = 100) {
  return Math.round(amount * factor);
}

/**
 * ナビゲーションバーの高さを定義する定数です。
 */
export const NAVBAR_HEIGHT = 48;

/**
 * コースのカテゴリを定義する配列です。
 */
export const courseCategories = [
  { value: "technology", label: "Technology" },
  { value: "science", label: "Science" },
  { value: "mathematics", label: "Mathematics" },
  { value: "artificial-intelligence", label: "Artificial Intelligence" },
] as const;

/**
 * DataGrid のカスタムスタイルを定義するオブジェクトです。
 */
export const customDataGridStyles = {
  border: "none",
  backgroundColor: "#17181D",
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#1B1C22",
    color: "#6e6e6e",
    "& [role='row'] > *": {
      backgroundColor: "#1B1C22 !important",
      border: "none !important",
    },
  },
  "& .MuiDataGrid-cell": {
    color: "#6e6e6e",
    border: "none !important",
  },
  "& .MuiDataGrid-row": {
    backgroundColor: "#17181D",
    "&:hover": {
      backgroundColor: "#25262F",
    },
  },
  "& .MuiDataGrid-footerContainer": {
    backgroundColor: "#17181D",
    color: "#6e6e6e",
    border: "none !important",
  },
  "& .MuiDataGrid-filler": {
    border: "none !important",
    backgroundColor: "#17181D !important",
    borderTop: "none !important",
    "& div": {
      borderTop: "none !important",
    },
  },
  "& .MuiTablePagination-root": {
    color: "#6e6e6e",
  },
  "& .MuiTablePagination-actions .MuiIconButton-root": {
    color: "#6e6e6e",
  },
};

/**
 * コースのフォームデータを FormData オブジェクトに変換します。
 * @param data - コースのフォームデータ
 * @param sections - セクションの配列
 * @returns FormData オブジェクト
 */
export const createCourseFormData = (
  data: CourseFormData,
  sections: Section[]
): FormData => {
  const formData = new FormData();
  formData.append("title", data.courseTitle);
  formData.append("description", data.courseDescription);
  formData.append("category", data.courseCategory);
  formData.append("price", data.coursePrice.toString());
  formData.append("status", data.courseStatus ? "Published" : "Draft");

  // セクションとビデオの情報を追加
  const sectionsWithVideos = sections.map((section) => ({
    ...section,
    chapters: section.chapters.map((chapter) => ({
      ...chapter,
      video: chapter.video,
    })),
  }));

  formData.append("sections", JSON.stringify(sectionsWithVideos));

  return formData;
};

/**
 * すべてのビデオをアップロードします。
 * @param localSections - ローカルのセクションデータ
 * @param courseId - コースID
 * @param getUploadVideoUrl - ビデオアップロードURLを取得する関数
 * @returns アップロード後のセクションデータ
 */
export const uploadAllVideos = async (
  localSections: Section[],
  courseId: string,
  getUploadVideoUrl: any
) => {
  // ローカルのセクションデータを更新
  const updatedSections = localSections.map((section) => ({
    ...section,
    chapters: section.chapters.map((chapter) => ({
      ...chapter,
    })),
  }));

  // 各セクションの各チャプターをループ処理
  for (let i = 0; i < updatedSections.length; i++) {
    for (let j = 0; j < updatedSections[i].chapters.length; j++) {
      const chapter = updatedSections[i].chapters[j];
      // ビデオがファイルであり、かつMP4形式の場合のみアップロード
      if (chapter.video instanceof File && chapter.video.type === "video/mp4") {
        try {
          // ビデオをアップロードし、チャプターデータを更新
          const updatedChapter = await uploadVideo(
            chapter,
            courseId,
            updatedSections[i].sectionId,
            getUploadVideoUrl
          );
          updatedSections[i].chapters[j] = updatedChapter;
        } catch (error) {
          console.error(
            `Failed to upload video for chapter ${chapter.chapterId}:`,
            error
          );
        }
      }
    }
  }

  return updatedSections;
};

/**
 * ビデオをアップロードする関数です。
 * @param chapter - チャプターデータ
 * @param courseId - コースID
 * @param sectionId - セクションID
 * @param getUploadVideoUrl - ビデオアップロードURLを取得する関数
 * @returns アップロード後のチャプターデータ
 */
async function uploadVideo(
  chapter: Chapter,
  courseId: string,
  sectionId: string,
  getUploadVideoUrl: any
) {
  const file = chapter.video as File;

  try {
    // アップロードURLとビデオURLを取得
    const { uploadUrl, videoUrl } = await getUploadVideoUrl({
      courseId,
      sectionId,
      chapterId: chapter.chapterId,
      fileName: file.name,
      fileType: file.type,
    }).unwrap();

    // ビデオをアップロード
    await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });
    toast.success(
      `Video uploaded successfully for chapter ${chapter.chapterId}`
    );

    // アップロード後のチャプターデータを返す
    return { ...chapter, video: videoUrl };
  } catch (error) {
    console.error(
      `Failed to upload video for chapter ${chapter.chapterId}:`,
      error
    );
    throw error;
  }
}
