export default function Card({ title, text, price, image }) {
  return (
    <article className="card">
      <img src={image} alt={title} loading="lazy" />
      <div className="card-info">
        <h3>{title}</h3>
        <p className="meta">{text}</p>
        {price && <p className="price">{price}</p>}
      </div>
    </article>
  );
}