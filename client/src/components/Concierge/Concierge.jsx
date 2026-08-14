import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { LuBell, LuCalendarCheck } from "react-icons/lu";
import styles from "./Concierge.module.css";

const FEATURES = [
  {
    title: "Instant SMS Confirmation",
    text: "You will receive an SMS confirmation once your reservation request is submitted.",
    Icon: IoChatbubbleEllipsesOutline,
  },
  {
    title: "Calendar Invite",
    text: "Upon approval, a custom calendar invite with venue details and valet parking information will be sent.",
    Icon: LuCalendarCheck,
  },
  {
    title: "Personal Concierge",
    text: "Our concierge team will contact you within 2 hours to finalize your experience.",
    Icon: LuBell,
  },
];

function Concierge() {
  return (
    <section className={styles.section} aria-labelledby="concierge-heading">
      <div className={styles.frame}>
        <header className={styles.header}>
          <h2 id="concierge-heading" className={styles.heading}>
            Automation &amp; Concierge Experience
          </h2>
          <div className={styles.divider} aria-hidden="true">
            <span className={styles.dividerLine} />
            <span className={styles.diamond} />
            <span className={styles.dividerLine} />
          </div>
        </header>

        <div className={styles.grid}>
          {FEATURES.map(({ title, text, Icon }) => (
            <article key={title} className={styles.item}>
              <span className={styles.iconWrap} aria-hidden="true">
                <Icon />
              </span>
              <h3 className={styles.itemTitle}>{title}</h3>
              <p className={styles.itemText}>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Concierge;
