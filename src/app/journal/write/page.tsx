"use client";

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function WriteJournalPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('creator-note');
  const [body, setBody] = useState('');
  const [saved, setSaved] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    // save to session storage as a simple demo
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('animestop-journal-draft', JSON.stringify({ title, category, body }));
    }
  };

  return (
    <>
      <Header />
      <main className="journal-page-container">
        <section className="journal-write">
          <h1>WRITE YOUR JOURNAL</h1>
          {saved && <div className="notice">Your journal draft has been saved for this session.</div>}
          <form onSubmit={submit} className="journal-write-form">
            <label>Title</label>
            <input value={title} onChange={(e)=>setTitle(e.target.value)} required />

            <label>Category</label>
            <select value={category} onChange={(e)=>setCategory(e.target.value)}>
              <option value="creator-note">Creator Note</option>
              <option value="behind-the-scenes">Behind the Scenes</option>
              <option value="reflection">Reflection</option>
              <option value="story-deep-dive">Story Deep Dive</option>
              <option value="community">Community</option>
            </select>

            <label>Your Story</label>
            <textarea value={body} onChange={(e)=>setBody(e.target.value)} rows={10} required />

            <button type="submit" className="btn primary">SUBMIT JOURNAL</button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
