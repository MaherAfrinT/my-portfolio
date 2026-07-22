import React, { useState, useEffect } from 'react';
import { collection, doc, getDocs, setDoc, deleteDoc, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Trash2 } from 'lucide-react';
import { COLLECTIONS } from '../../lib/constants';

export function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [initialSkills, setInitialSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchSkills() {
      try {
        const q = query(collection(db, COLLECTIONS.SKILLS), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        const fetchedSkills = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSkills(fetchedSkills);
        setInitialSkills(fetchedSkills);
      } catch (err) {
        console.error('Failed to load skills', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const currentIds = skills.map((s) => s.id).filter(Boolean);
      const toDelete = initialSkills.filter((s) => s.id && !currentIds.includes(s.id));

      for (const cat of toDelete) {
        await deleteDoc(doc(db, COLLECTIONS.SKILLS, cat.id));
      }

      const updatedSkills = [];
      for (let i = 0; i < skills.length; i++) {
        const cat = { ...skills[i], order: i };
        let newId = cat.id;
        if (cat.id) {
          await setDoc(doc(db, COLLECTIONS.SKILLS, cat.id), cat, { merge: true });
        } else {
          const docRef = await addDoc(collection(db, COLLECTIONS.SKILLS), cat);
          newId = docRef.id;
        }
        updatedSkills.push({ ...cat, id: newId });
      }
      
      setSkills(updatedSkills);
      setInitialSkills(updatedSkills);
      setMessage('Skills saved successfully!');
    } catch (error) {
      console.error('Error saving skills:', error);
      setMessage('Failed to save skills.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const addCategory = () => {
    setSkills([
      ...skills,
      { category: 'New Category', iconName: 'Code', items: [] },
    ]);
  };

  const updateCategory = (index, field, value) => {
    const updated = [...skills];
    updated[index][field] = value;
    setSkills(updated);
  };

  const removeCategory = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addItem = (catIndex) => {
    const updated = [...skills];
    updated[catIndex].items.push({ name: 'New Skill', icon: 'javascript' });
    setSkills(updated);
  };

  const updateItem = (catIndex, itemIndex, field, value) => {
    const updated = [...skills];
    let item = updated[catIndex].items[itemIndex];
    if (typeof item === 'string') {
      item = { name: item, icon: 'javascript' };
    }
    item[field] = value;
    updated[catIndex].items[itemIndex] = item;
    setSkills(updated);
  };

  const removeItem = (catIndex, itemIndex) => {
    const updated = [...skills];
    updated[catIndex].items = updated[catIndex].items.filter(
      (_, i) => i !== itemIndex
    );
    setSkills(updated);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Skills</h1>
        <Button
          onClick={handleSave}
          isLoading={saving}
          className="bg-cyan-500 font-bold text-[#0e2a36] hover:bg-cyan-600"
        >
          Save Changes
        </Button>
      </div>

      {message && (
        <div
          className={`rounded-md p-4 ${message.includes('success') ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}
        >
          {message}
        </div>
      )}

      <div className="space-y-8">
        {skills.map((category, catIndex) => (
          <Card key={catIndex} className="border-cyan-500/30">
            <div className="flex flex-col items-start justify-between gap-4 rounded-t-xl border-b border-slate-200 bg-slate-100 p-4 md:flex-row md:items-center dark:border-slate-700 dark:bg-slate-800">
              <div className="flex w-full flex-1 flex-col gap-4 md:w-auto md:flex-row">
                <div className="max-w-xs flex-1 space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">
                    Category Name
                  </label>
                  <Input
                    value={category.category}
                    onChange={(e) =>
                      updateCategory(catIndex, 'category', e.target.value)
                    }
                    className="border-cyan-500/50 font-bold"
                  />
                </div>
                <div className="w-32 space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">
                    Icon Name
                  </label>
                  <Input
                    value={category.iconName || 'Code'}
                    onChange={(e) =>
                      updateCategory(catIndex, 'iconName', e.target.value)
                    }
                    title="Lucide icon name (e.g. Code, Globe, Terminal)"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">
                    Custom Image URL (Overrides Icon)
                  </label>
                  <Input
                    value={category.categoryImageUrl || ''}
                    onChange={(e) =>
                      updateCategory(catIndex, 'categoryImageUrl', e.target.value)
                    }
                    placeholder="e.g. https://example.com/icon.png"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => removeCategory(catIndex)}
                className="border-red-200 text-red-500 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Category
              </Button>
            </div>

            <CardContent className="space-y-4 p-6">
              {category.items.map((item, itemIndex) => {
                const isLegacy = typeof item === 'string';
                const name = isLegacy
                  ? item
                  : item.name ||
                    item.title ||
                    item.label ||
                    String(Object.values(item)[0] || '');
                const icon = isLegacy ? '' : item.icon || '';

                return (
                  <div
                    key={itemIndex}
                    className="flex flex-col items-center gap-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:flex-row dark:border-slate-700 dark:bg-slate-900"
                  >
                    {/* Live Preview */}
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-slate-100 p-2 dark:bg-slate-800">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={name}
                          className="h-full w-full object-contain"
                          onError={(e) => (e.target.style.display = 'none')}
                          onLoad={(e) => (e.target.style.display = 'block')}
                        />
                      ) : icon ? (
                        <img
                          src={`https://cdn.simpleicons.org/${icon}/00ffcc`}
                          alt={name}
                          className="h-full w-full object-contain"
                          onError={(e) => (e.target.style.display = 'none')}
                          onLoad={(e) => (e.target.style.display = 'block')}
                        />
                      ) : (
                        <div className="h-full w-full rounded-full bg-slate-200 dark:bg-slate-700" />
                      )}
                    </div>

                    <div className="w-full flex-1 space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">
                            Skill Name
                          </label>
                          <Input
                            value={name}
                            onChange={(e) =>
                              updateItem(
                                catIndex,
                                itemIndex,
                                'name',
                                e.target.value
                              )
                            }
                            placeholder="e.g. React"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="flex justify-between text-xs font-medium text-slate-500">
                            <span>SimpleIcons Slug</span>
                            <a
                              href="https://simpleicons.org/"
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-500 hover:underline"
                            >
                              Lookup
                            </a>
                          </label>
                          <Input
                            value={icon}
                            onChange={(e) =>
                              updateItem(
                                catIndex,
                                itemIndex,
                                'icon',
                                e.target.value
                              )
                            }
                            placeholder="e.g. react"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">
                          Custom Image URL (Overrides SimpleIcons)
                        </label>
                        <Input
                          value={item.imageUrl || ''}
                          onChange={(e) =>
                            updateItem(
                              catIndex,
                              itemIndex,
                              'imageUrl',
                              e.target.value
                            )
                          }
                          placeholder="e.g. https://example.com/icon.png"
                        />
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      onClick={() => removeItem(catIndex, itemIndex)}
                      className="h-10 text-slate-400 hover:text-red-500 sm:self-end"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}

              <Button
                variant="outline"
                onClick={() => addItem(catIndex)}
                className="mt-4 w-full border-2 border-dashed text-slate-500 hover:border-cyan-500 hover:text-cyan-500"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Skill to{' '}
                {category.category}
              </Button>
            </CardContent>
          </Card>
        ))}

        <Button
          variant="outline"
          onClick={addCategory}
          className="h-16 w-full border-2 border-dashed text-lg text-slate-500 hover:border-cyan-500 hover:text-cyan-500"
        >
          <Plus className="mr-2 h-5 w-5" /> Add New Skill Category
        </Button>
      </div>
    </div>
  );
}
