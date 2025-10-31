import React, { useState, useEffect } from 'react';
import Card from './common/Card';

interface KeywordList {
    id: string;
    name: string;
    keywords: string[];
    createdAt: string;
}

const KeywordLists: React.FC = () => {
    const [lists, setLists] = useState<KeywordList[]>([]);
    const [newListName, setNewListName] = useState('');
    const [selectedList, setSelectedList] = useState<KeywordList | null>(null);
    const [newKeyword, setNewKeyword] = useState('');

    useEffect(() => {
        const savedLists = JSON.parse(localStorage.getItem('keyword_lists') || '[]');
        setLists(savedLists);
    }, []);

    const updateLocalStorage = (updatedLists: KeywordList[]) => {
        localStorage.setItem('keyword_lists', JSON.stringify(updatedLists));
    };

    const handleCreateList = () => {
        if (!newListName.trim()) return;
        const newList: KeywordList = {
            id: Date.now().toString(),
            name: newListName.trim(),
            keywords: [],
            createdAt: new Date().toISOString(),
        };
        const updatedLists = [...lists, newList];
        setLists(updatedLists);
        updateLocalStorage(updatedLists);
        setNewListName('');
    };

    const handleDeleteList = (listId: string) => {
        const updatedLists = lists.filter(list => list.id !== listId);
        setLists(updatedLists);
        updateLocalStorage(updatedLists);
        if (selectedList?.id === listId) {
            setSelectedList(null);
        }
    };
    
    const handleAddKeyword = () => {
        if (!selectedList || !newKeyword.trim()) return;
        const updatedKeywords = [...selectedList.keywords, newKeyword.trim()];
        const updatedList = { ...selectedList, keywords: updatedKeywords };
        const updatedLists = lists.map(list => list.id === selectedList.id ? updatedList : list);
        setLists(updatedLists);
        setSelectedList(updatedList);
        updateLocalStorage(updatedLists);
        setNewKeyword('');
    };
    
    const handleRemoveKeyword = (keywordToRemove: string) => {
        if (!selectedList) return;
        const updatedKeywords = selectedList.keywords.filter(kw => kw !== keywordToRemove);
        const updatedList = { ...selectedList, keywords: updatedKeywords };
        const updatedLists = lists.map(list => list.id === selectedList.id ? updatedList : list);
        setLists(updatedLists);
        setSelectedList(updatedList);
        updateLocalStorage(updatedLists);
    };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Keyword Lists</h2>
        <p className="mt-2 text-lg text-slate-600">
          Create, save, and manage lists of your favorite keywords to organize your research.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
            <Card title="My Lists">
                 <div className="flex gap-2">
                    <input
                        type="text"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        placeholder="New list name..."
                        className="flex-grow w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-orange-500"
                    />
                    <button onClick={handleCreateList} className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600">Add</button>
                </div>
                <div className="mt-4 space-y-2">
                    {lists.map(list => (
                        <div key={list.id} onClick={() => setSelectedList(list)} className={`p-3 rounded-lg cursor-pointer flex justify-between items-center ${selectedList?.id === list.id ? 'bg-orange-100' : 'hover:bg-slate-50'}`}>
                           <div>
                             <p className="font-semibold text-slate-800">{list.name}</p>
                             <p className="text-xs text-slate-500">{list.keywords.length} keywords</p>
                           </div>
                           <button onClick={(e) => { e.stopPropagation(); handleDeleteList(list.id); }} className="text-slate-400 hover:text-red-500">
                               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                           </button>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
        <div className="md:col-span-2">
            {selectedList ? (
                <Card title={`Keywords in "${selectedList.name}"`}>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            placeholder="Add a new keyword..."
                            className="flex-grow w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-orange-500"
                        />
                        <button onClick={handleAddKeyword} className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600">Add</button>
                    </div>
                    {selectedList.keywords.length > 0 ? (
                        <div className="space-y-2">
                            {selectedList.keywords.map((keyword, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-md">
                                    <span className="text-slate-700">{keyword}</span>
                                    <button onClick={() => handleRemoveKeyword(keyword)} className="text-slate-400 hover:text-red-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-slate-500 py-6">This list is empty. Add some keywords!</p>
                    )}
                </Card>
            ) : (
                 <Card title="Select a List">
                    <div className="text-center py-20">
                        <p className="text-slate-500">Select a list from the left to view its keywords, or create a new list to get started.</p>
                    </div>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
};

export default KeywordLists;