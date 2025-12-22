import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/work_experience/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${file.originalname.replace(/\s/g, "_")}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [".pdf", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) {
    return cb(new Error("Only PDF and DOCX allowed"));
  }
  cb(null, true);
};

const uploadWorkExperience = multer({
  storage,
  fileFilter,
});

export default uploadWorkExperience;
