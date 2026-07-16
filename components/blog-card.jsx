import { Link } from "@/i18n/navigation";

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d)
    ? iso
    : d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

const BlogCard = ({
  imageSrc = "",
  imgAltText = "",
  title = "",
  excerpt = "",
  href,
  date,
  readNowText = "Read Now",
}) => {
  const alt = imgAltText || title || "Blog image";

  const Card = (
    <article className="bg-white rounded-lg overflow-hidden transition-shadow duration-300 h-[600px] flex flex-col">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={alt}
          className="w-full h-60 object-cover shrink-0"
        />
      ) : null}

      <div className="p-8 flex flex-col flex-1">
        {title && (
          <h3 className="text-xl font-bold text-bronze mb-2">{title}</h3>
        )}
        {excerpt && (
          <p
            className="text-bronze/70 mb-6 font-light flex-1"
            dangerouslySetInnerHTML={{ __html: excerpt }}
          />
        )}

        <span className="inline-block bg-bronze text-cream px-6 py-2 rounded-none font-medium text-sm tracking-wide uppercase group-hover:bg-bronze/80 mt-auto self-start">
          {readNowText}
        </span>
      </div>
    </article>
  );

  return href ? (
    <Link
      href={href}
      className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-bronze rounded-lg hover:shadow-xl transition-shadow duration-300"
    >
      {Card}
    </Link>
  ) : (
    <div className="block group">{Card}</div>
  );
};

export default BlogCard;
