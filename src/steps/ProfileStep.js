import React, { useCallback } from 'react';
import { AvatarUpload, Input } from '../Builder';

export default function ProfileStep({ data, setData, goNext }) {
  const set = useCallback((key, val) => setData((d) => ({ ...d, [key]: val })), [setData]);

  return (
    <>
      <header className="panel-header">
        <h2>Profile</h2>
        <p>How visitors see you at the top of your page.</p>
      </header>
      <AvatarUpload
        avatar={data.avatar}
        name={data.name}
        onSet={(val) => set('avatar', val)}
        onClear={() => set('avatar', null)}
      />
      <Input
        label="Display name"
        value={data.name}
        onChange={(v) => set('name', v)}
        placeholder="Maya Chen"
        maxLength={40}
      />
      <Input
        label="Bio"
        value={data.bio}
        onChange={(v) => set('bio', v)}
        placeholder="Photographer & travel writer. Currently in Lisbon."
        maxLength={120}
        multiline
        hint={`${data.bio.length}/120 characters`}
      />
      <div className="step-nav-buttons">
        <span />
        <button type="button" className="btn btn--landing-primary" onClick={goNext}>
          Next →
        </button>
      </div>
    </>
  );
}
