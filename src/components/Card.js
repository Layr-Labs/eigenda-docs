import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./Card.module.css";

function Card({ to, header, body }) {
  return (
    <div className={clsx("col col--4 ", styles.feature)}>
      <Link className={styles.card} to={to}>
        <div className={styles.cardHeader}>
          <h2>{header}</h2>
        </div>
        <div className={styles.cardBody}>
          <p>{body} →</p>
        </div>
      </Link>
    </div>
  );
}

export default Card;
