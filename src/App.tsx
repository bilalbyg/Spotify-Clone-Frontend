import {
  Play,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Home,
  Search,
  Library,
  Plus,
  Heart,
} from 'lucide-react';

function App() {
  return (
    <div className="flex h-screen w-full bg-black text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-black flex flex-col gap-2 p-2 shrink-0">
        <div className="bg-zinc-900 rounded-lg p-4 flex flex-col gap-4">
          <div className="flex items-center gap-4 text-zinc-400 hover:text-white transition cursor-pointer">
            <Home size={24} />
            <span className="font-bold">Ana Sayfa</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400 hover:text-white transition cursor-pointer">
            <Search size={24} />
            <span className="font-bold">Göz At</span>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-4 flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400">
            <div className="flex items-center gap-2 hover:text-white transition cursor-pointer">
              <Library size={24} />
              <span className="font-bold">Kitaplığın</span>
            </div>
            <Plus size={20} className="hover:text-white cursor-pointer" />
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto pr-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-md transition cursor-pointer group"
              >
                <div className="w-12 h-12 bg-zinc-800 rounded shadow-lg flex items-center justify-center">
                  <Heart size={20} className="text-zinc-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">Beğenilen Şarkılar</span>
                  <span className="text-xs text-zinc-400">Çalma Listesi • {item * 12} şarkı</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-b from-zinc-800 to-zinc-900 m-2 ml-0 rounded-lg overflow-y-auto">
        <header className="p-6 flex items-center justify-between sticky top-0 bg-transparent backdrop-blur-sm z-10">
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center cursor-not-allowed">
              <SkipBack className="rotate-180" size={20} />
            </div>
            <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center cursor-not-allowed">
              <SkipForward className="rotate-180" size={20} />
            </div>
          </div>
          <button className="bg-white text-black font-bold py-2 px-8 rounded-full hover:scale-105 transition active:scale-95">
            Oturum Aç
          </button>
        </header>

        <section className="p-6">
          <h1 className="text-3xl font-bold mb-6">İyi akşamlar</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-zinc-800/50 hover:bg-zinc-700/50 transition rounded cursor-pointer group overflow-hidden"
              >
                <div className="w-20 h-20 bg-zinc-700 shrink-0 shadow-xl"></div>
                <span className="font-bold">Favori Playlist {i}</span>
                <div className="ml-auto mr-4 opacity-0 group-hover:opacity-100 transition translate-y-2 group-hover:translate-y-0">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-2xl">
                    <Play fill="black" className="text-black ml-1" size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold hover:underline cursor-pointer">
              Sizin için derlendi
            </h2>
            <span className="text-xs font-bold text-zinc-400 hover:underline cursor-pointer uppercase tracking-widest">
              Hepsini Gör
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="p-4 bg-zinc-900/40 hover:bg-zinc-800/60 transition rounded-lg cursor-pointer group"
              >
                <div className="relative aspect-square mb-4">
                  <div className="w-full h-full bg-zinc-800 rounded-md shadow-2xl"></div>
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition transform translate-y-2 group-hover:translate-y-0 shadow-2xl">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                      <Play fill="black" className="text-black ml-1" size={24} />
                    </div>
                  </div>
                </div>
                <h3 className="font-bold truncate">Daily Mix {i}</h3>
                <p className="text-sm text-zinc-400 line-clamp-2 mt-1">
                  Sizin için hazırlanan özel çalma listesi.
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Player Bar (Placeholder) */}
      <footer className="fixed bottom-0 left-0 right-0 h-24 bg-black border-t border-zinc-900 px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-4 w-[30%]">
          <div className="w-14 h-14 bg-zinc-800 rounded shadow-lg"></div>
          <div>
            <div className="text-sm font-medium hover:underline cursor-pointer">Şu An Çalıyor</div>
            <div className="text-xs text-zinc-400 hover:underline cursor-pointer">Sanatçı İsmi</div>
          </div>
          <Heart size={16} className="text-zinc-400 hover:text-white cursor-pointer ml-2" />
        </div>

        <div className="flex flex-col items-center gap-2 max-w-[40%] w-full">
          <div className="flex items-center gap-6 text-zinc-400">
            <Shuffle size={20} className="hover:text-white cursor-pointer" />
            <SkipBack size={20} fill="currentColor" className="hover:text-white cursor-pointer" />
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition cursor-pointer">
              <Play fill="black" size={20} className="text-black ml-1" />
            </div>
            <SkipForward
              size={20}
              fill="currentColor"
              className="hover:text-white cursor-pointer"
            />
            <Repeat size={20} className="hover:text-white cursor-pointer" />
          </div>
          <div className="flex items-center gap-2 w-full">
            <span className="text-[10px] text-zinc-400">0:00</span>
            <div className="h-1 bg-zinc-800 rounded-full flex-1 relative group cursor-pointer">
              <div className="absolute h-full bg-white w-1/3 rounded-full group-hover:bg-green-500"></div>
            </div>
            <span className="text-[10px] text-zinc-400">3:45</span>
          </div>
        </div>

        <div className="w-[30%] flex justify-end">
          <div className="text-green-500 text-sm font-bold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Sistem Hazır
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
