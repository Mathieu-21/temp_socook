import { useEffect, useState } from "react";
import mockUser from "../mocks/mockUser.json";

interface User {
  id: string;
  username: string;
  email: string;
  address?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
      setUser(mockUser as User);
      setLoading(false);
  }, []);

  const [form, setForm] = useState({
    username: "",
    email: "",
    address: "",
    bio: "",
    avatarUrl: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username,
        email: user.email,
        address: user.address || "",
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      setUser({ ...user, ...form });
      setSaved(true);
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!user) return null;

  return (
    <div className="max-w-md mx-auto mt-10 mb-8 p-6 bg-white rounded-xl shadow-md">
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
        <input
          type="file"
          accept="image/*"
          id="avatar-upload"
          style={{ display: "none" }}
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setForm(f => ({ ...f, avatarUrl: reader.result as string }));
                setSaved(false);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        <div
          className="w-24 h-24 rounded-full mb-4 object-cover border overflow-hidden cursor-pointer group relative"
          onClick={() => document.getElementById("avatar-upload")?.click()}
        >
          <img
            src={form.avatarUrl || "https://ui-avatars.com/api/?name=User"}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <span className="text-white text-xs">Changer la photo</span>
          </div>
        </div>
        {/* Champ username avec floating label */}
        <div className="relative w-full mb-6">
          <input
            type="text"
            name="username"
            id="username"
            value={form.username}
            onChange={handleChange}
            required
            className="block px-2 pt-4 pb-1 w-full text-sm text-gray-900 bg-transparent rounded-md border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-all peer shadow-sm"
            placeholder=" "
            autoComplete="off"
          />
          <label
            htmlFor="username"
            className="absolute left-2 top-1.5 text-gray-500 text-xs pointer-events-none transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-green-600"
          >
            Nom d'utilisateur
          </label>
        </div>
        {/* Champ email avec floating label */}
        <div className="relative w-full mb-6">
          <input
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            required
            className="block px-2 pt-4 pb-1 w-full text-sm text-gray-900 bg-transparent rounded-md border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-all peer shadow-sm"
            placeholder=" "
            autoComplete="off"
          />
          <label
            htmlFor="email"
            className="absolute left-2 top-1.5 text-gray-500 text-xs pointer-events-none transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-green-600"
          >
            Email
          </label>
        </div>
        {/* Champ adresse avec floating label */}
        <div className="relative w-full mb-6">
          <input
            type="text"
            name="address"
            id="address"
            value={form.address}
            onChange={handleChange}
            className="block px-2 pt-4 pb-1 w-full text-sm text-gray-900 bg-transparent rounded-md border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-all peer shadow-sm"
            placeholder=" "
            autoComplete="off"
          />
          <label
            htmlFor="address"
            className="absolute left-2 top-1.5 text-gray-500 text-xs pointer-events-none transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-green-600"
          >
            Adresse
          </label>
        </div>
        {/* Champ bio avec floating label */}
        <div className="relative w-full mb-6">
          <textarea
            name="bio"
            id="bio"
            value={form.bio}
            onChange={handleChange}
            className="block px-2 pt-4 pb-1 w-full text-sm text-gray-900 bg-transparent rounded-md border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-all peer shadow-sm resize-none"
            placeholder=" "
            rows={2}
          />
          <label
            htmlFor="bio"
            className="absolute left-2 top-1.5 text-gray-500 text-xs pointer-events-none transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-green-600"
          >
            Bio
          </label>
        </div>

        <button
          type="submit"
          className="mt-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Enregistrer
        </button>
        {saved && <p className="mt-4 text-green-600">Profil enregistré !</p>}
        <p className="text-xs text-gray-400 mt-8">
          Créé le : {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </form>
    </div>
  );
}