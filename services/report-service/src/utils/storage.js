import admin from "firebase-admin";

export async function uploadFileAndGetURL(buffer, path, contentType) {
  const bucket = admin.storage().bucket();
  const file = bucket.file(path);

  await file.save(buffer, { contentType });
  await file.makePrivate(); // acceso solo con URL firmada

  const [url] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 60 * 60 * 1000, // 1h
  });

  return url;
}
