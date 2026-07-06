import React, { useCallback } from 'react';
import { LinkRow } from '../Builder';

export default function LinksStep({ data, setData, goNext, goPrev }) {
  const updateLink = useCallback((index, key, val) => {
    setData((d) => {
      const links = [...d.links];
      links[index] = { ...links[index], [key]: val };
      return { ...d, links };
    });
  }, [setData]);

  const moveLink = (index, dir) => {
    setData((d) => {
      const links = [...d.links];
      const next = index + dir;
      if (next < 0 || next >= links.length) return d;
      [links[index], links[next]] = [links[next], links[index]];
      return { ...d, links };
    });
  };

  const addLink = () =>
    setData((d) => ({ ...d, links: [...d.links, { type: 'other', label: '', url: '' }] }));

  const removeLink = (i) =>
    setData((d) => ({ ...d, links: d.links.filter((_, idx) => idx !== i) }));

  return (
    <>
      <header className="panel-header">
        <h2>Links</h2>
        <p>Add every destination you want one tap away.</p>
      </header>
      {data.links.map((link, i) => (
        <LinkRow
          key={i}
          link={link}
          index={i}
          total={data.links.length}
          onChange={updateLink}
          onRemove={removeLink}
          onMove={moveLink}
        />
      ))}
      <button type="button" className="add-link-btn" onClick={addLink}>
        + Add another link
      </button>
      <div className="step-nav-buttons">
        <button type="button" className="btn btn--ghost" onClick={goPrev}>
          ← Back
        </button>
        <button type="button" className="btn btn--landing-primary" onClick={goNext}>
          Next →
        </button>
      </div>
    </>
  );
}
