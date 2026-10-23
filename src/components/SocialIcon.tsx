import Image from "next/image";
import styles from "@/app/page.module.css";

export default function SocialIcon({ id, name }: { id: string; name: string }) {
  const src = id === "phone" ? "/social/phone-3d.png" : `/social/${id}.png`;

  return (
    <Image
      src={src}
      alt={name}
      width={256}
      height={256}
      className={styles.socialImg}
      unoptimized
    />
  );
}
