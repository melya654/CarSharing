import { useState } from 'react';

export default function Card({ title, text, price, image }) {
  const [count, setCount] = useState(0);

  return (
    <article className="card">
      <img src={image} alt={title} loading="lazy" />
      <div className="card-info">
        <h3>{title}</h3>
        <p className="meta">{text}</p>
        {price && <p className="price">{price}</p>}
        <button type="button" className="btn btn-ghost" onClick={() => setCount(count + 1)}>
          ♥ Подобається: {count}
        </button>
      </div>
    </article>
  );
}