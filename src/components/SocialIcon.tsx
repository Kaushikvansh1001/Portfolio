import Image from "next/image";
import styles from "@/app/page.module.css";

export default function SocialIcon({ id, name }: { id: string; name: string }) {
  return (
    <Image
      src={`/social/${id}.png`}
      alt={name}
      width={256}
      height={256}
      className={styles.socialImg}
    />
  );
}
