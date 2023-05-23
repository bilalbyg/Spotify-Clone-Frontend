import React, { useState } from "react";
import { Icon } from "../Icons";
import { Button, Form, Input, Select } from "semantic-ui-react";

export default function Account() {
  const [toggleState, setToggleState] = useState(1);

  const updateToggle = (id) => {
    setToggleState(id);
  };

  const genderOptions = [
    { key: "e", text: "Erkek", value: "Erkek" },
    { key: "k", text: "Kadın", value: "Kadın" },
    { key: "d", text: "Diğer", value: "Diğer" },
  ];

  const monthOptions = [
    { key: "1", text: "Ocak", value: "Ocak" },
    { key: "2", text: "Şubat", value: "Şubat" },
    { key: "3", text: "Mart", value: "Mart" },
    { key: "4", text: "Nisan", value: "Nisan" },
    { key: "5", text: "Mayıs", value: "Mayıs" },
    { key: "6", text: "Haziran", value: "Haziran" },
    { key: "7", text: "Temmuz", value: "Temmuz" },
    { key: "8", text: "Ağustos", value: "Ağustos" },
    { key: "9", text: "Eylül", value: "Eylül" },
    { key: "10", text: "Ekim", value: "Ekim" },
    { key: "11", text: "Kasım", value: "Kasım" },
    { key: "12", text: "Aralık", value: "Aralık" },
  ];

  return (
    <div className="flex items-center justify-center ">
      <div className="flex flex-row bg-backdrop w-[72rem] h-auto">
        <div className="flex flex-col bg-backdrop items-center justify-start w-[20rem]">
          <div className="w-16 h-16">
            <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" />
          </div>
          <div className="flex flex-col gap-x-1 mt-10 w-full">
            <div
              onClick={() => updateToggle(1)}
              className={`${
                toggleState === 1
                  ? "border-primary text-link"
                  : "border-transparent text-white"
              } flex flex-row gap-x-4 justify-start items-center px-4 py-2 bg-active font-semibold hover:text-link border-l-8 cursor-pointer hover:border-primary`}
            >
              <Icon name="home" />
              <span>Hesap Genel Görünümü</span>
            </div>
            <div
              onClick={() => updateToggle(2)}
              className={`${
                toggleState === 2
                  ? "border-primary text-link"
                  : "border-transparent text-white"
              } flex flex-row gap-x-4 justify-start items-center px-4 py-2 bg-active font-semibold hover:text-link border-l-8 cursor-pointer hover:border-primary`}
            >
              <Icon name="edit" />
              <span>Profili Düzenle</span>
            </div>
            <div
              onClick={() => updateToggle(3)}
              className={`${
                toggleState === 3
                  ? "border-primary text-link"
                  : "border-transparent text-white"
              } flex flex-row gap-x-4 justify-start items-center px-4 py-2 bg-active font-semibold hover:text-link border-l-8 cursor-pointer hover:border-primary`}
            >
              <Icon name="lock" />
              <span>Parola Değiştir</span>
            </div>
          </div>
        </div>

        <div
          className={`${
            toggleState === 1 ? "flex flex-col" : "hidden"
          }  w-[52rem] px-16`}
        >
          <h1 className="text-white text-5xl font-bold tracking-tight">
            Hesap Genel Görünümü
          </h1>
          <h3 className="text-white text-2xl font-bold tracking-tight mt-10">
            Profil
          </h3>
          <div className="w-[50rem] my-5">
            <table className="w-full">
              <tbody className="">
                <tr className="w-full">
                  <td className="text-link font-semibold w-[50%] py-5">
                    Kullanıcı Adı
                  </td>
                  <td className="text-white font-semibold w-[50%] py-5">
                    JohnDoe
                  </td>
                </tr>
                <tr className="w-full">
                  <td className="text-link font-semibold w-[50%] py-5">
                    E-posta
                  </td>
                  <td className="text-white font-semibold w-[50%] py-5">
                    john@doe.com
                  </td>
                </tr>
                <tr className="w-full">
                  <td className="text-link font-semibold w-[50%] py-5">
                    Doğum Tarihi
                  </td>
                  <td className="text-white font-semibold w-[50%] py-5">
                    01.01.2000
                  </td>
                </tr>
                <tr className="w-full">
                  <td className="text-link font-semibold w-[50%] py-5">
                    Ülke veya Bölge
                  </td>
                  <td className="text-white font-semibold w-[50%] py-5">
                    Türkiye
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div
          className={`${
            toggleState === 2 ? "flex flex-col" : "hidden"
          } bg-backdrop w-[52rem] px-16`}
        >
          <div className="flex flex-col">
            <div className="text-white ">
              <span className="font-bold text-white text-5xl tracking-wide">
                Profili Düzenle
              </span>
            </div>
            <form className="mt-10">
              <div className="flex flex-col gap-y-2 py-2">
                <label>
                  <span className="text-white text-sm font-semibold">
                    E-posta adresi
                  </span>
                </label>
                <input
                  placeholder="E-posta adresi"
                  className="rounded p-2 text-sm font-semibold text-backdrop border-2 border-podcast hover:border-link"
                />
              </div>
              <div className="flex flex-col gap-y-2 py-2">
                <label>
                  <span className="text-white text-sm font-semibold">
                    Parola
                  </span>
                </label>
                <input disabled className="rounded p-2 hover:cursor-no-drop" />
              </div>
              <div className="flex flex-col gap-y-2 py-2">
                <label>
                  <span className="text-white text-sm font-semibold">Cinsiyet</span>
                </label>
                <select className="rounded p-2 text-sm font-semibold text-backdrop border-2 border-podcast hover:border-link">
                  {genderOptions.map((option) => (
                    <option key={option.key} value={option.value}>
                      {option.text}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-y-2 py-2">
                <label>
                  <span className="text-white text-sm font-semibold">Doğum tarihi</span>
                </label>
                <div className="flex flex-row gap-x-4 w-full">
                  <div className="w-1/3">
                    <input
                    type="number"
                      placeholder="Gün"
                      className="placeholder-shown:font-bold w-full rounded p-2 text-sm font-semibold text-backdrop border-2 border-podcast hover:border-link"
                    />
                  </div>
                  <div className="w-1/3">
                    <select className="w-full rounded p-2 text-sm font-semibold text-backdrop border-2 border-podcast hover:border-link">
                      {monthOptions.map((month) => (
                        <option key={month.key} value={month.value}>
                          {month.text}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-1/3">
                    <input
                    type="number"
                      placeholder="Yıl"
                      className="placeholder-shown:font-bold w-full rounded p-2 text-sm font-semibold text-backdrop border-2 border-podcast hover:border-link"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-end py-2">
                <button
                  className="bg-primary text-black text-lg font-bold rounded-[31.25rem] px-8 py-2 border-4 border-backdrop focus:outline outline-3 outline-white hover:scale-[1.06]"
                  type="submit"
                >
                  Profili Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
        <div
          className={`${
            toggleState === 3 ? "flex flex-col" : "hidden"
          } bg-backdrop w-[52rem] px-16`}
        >
          <div className="flex flex-col">
            <div className="text-white ">
              <span className="font-bold text-white text-5xl tracking-wide">
                Parolanı Değiştir
              </span>
            </div>
            <form className="mt-10">
              <div className="flex flex-col gap-y-2 py-2">
                <label>
                  <span className="font-semibold text-white">Geçerli parola</span>
                </label>
                <input placeholder="Geçerli parola" className="placeholder-shown:font-bold rounded p-2 text-sm font-semibold text-backdrop border-2 border-podcast hover:border-link"/>
              </div>
              <div className="flex flex-col gap-y-2 py-2">
                <label>
                  <span className="text-white font-semibold">Yeni parola</span>
                </label>
                <input placeholder="Yeni parola" className="placeholder-shown:font-bold rounded p-2 text-sm font-semibold text-backdrop border-2 border-podcast hover:border-link" />
              </div>
              <div className="flex flex-col gap-y-2 py-2">
                <label>
                  <span className="text-white font-semibold">Yeni parolayı tekrarla</span>
                </label>
                <input placeholder="Yeni parolayı tekrarla" className="placeholder-shown:font-bold rounded p-2 text-sm font-semibold text-backdrop border-2 border-podcast hover:border-link"/>
              </div>
              <div className="flex items-end justify-end py-2">
                <button
                  className="bg-primary text-black text-lg font-bold rounded-[31.25rem] px-8 py-2 border-4 border-backdrop focus:outline outline-3 outline-white hover:scale-[1.06]"
                  type="submit"
                >
                  Yeni Parola Belirle
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
