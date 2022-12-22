import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import SidebarLinkGroup from "./SidebarLinkGroup";
import Image from "next/image";
import { HiOutlineHome, HiOutlineUserGroup } from "react-icons/hi";
import { RxDashboard } from "react-icons/rx";
import { TfiAngleDown } from "react-icons/tfi";
import { MdRestaurantMenu, MdPermContactCalendar } from "react-icons/md";
import { RiGalleryFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { categoryGet } from "../api/category";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useRouter();
  const [pathname, setPathName] = useState(location.pathname);
  const [category, setCategory] = useState([]);
  const isLoad = useSelector((state) => state.loader.isLoad);
  const token = useSelector((state) => state.auth.token);

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  useEffect(() => {
    setPathName(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    (async () => {
      const res = await categoryGet(token);
      // console.log(res.data, '<---');
      setCategory(res.data);
    })();
  }, [isLoad, token]);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-slate-800 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-slate-500 hover:text-slate-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <Link href="/" className="block relative w-12 h-12">
            <Image
              src="/images/logo.png"
              alt="logo"
              fill
              className="absolute"
            />
          </Link>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
              <span
                className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
                aria-hidden="true"
              >
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                Pages
              </span>
            </h3>
            <ul className="mt-3">
              {/* Dashboard */}

              <li
                className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                  pathname === "/" && "bg-slate-900"
                }`}
              >
                <Link
                  href="/"
                  className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                    pathname === "/" && "hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center">
                    <RxDashboard className="shrink-0 h-6 w-6" />
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Dashboard
                    </span>
                  </div>
                </Link>
              </li>

              {/* Home */}
              <SidebarLinkGroup activecondition={pathname.includes("/home")}>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#"
                        className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                          pathname.includes("/home") && "hover:text-slate-200"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <HiOutlineHome className="shrink-0 h-6 w-6" />
                            <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Home
                            </span>
                          </div>
                          <div className="flex shrink-0 ml-2">
                            <TfiAngleDown
                              className={`${open && "rotate-180"}`}
                            />
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-9 mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0">
                            <Link
                              href="/home/banner-uploads"
                              className="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Banner Uploads
                              </span>
                            </Link>
                          </li>

                          <li className="mb-1 last:mb-0">
                            <Link
                              href="/home/testimonials"
                              className="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Testimonials
                              </span>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              {/* About */}
              <li
                className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                  pathname === "/about" && "bg-slate-900"
                }`}
              >
                <Link
                  href="/about"
                  className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                    pathname === "/about" && "hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center">
                    <HiOutlineUserGroup className="shrink-0 h-6 w-6" />
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      About
                    </span>
                  </div>
                </Link>
              </li>

              {/* Menu */}
              <SidebarLinkGroup activecondition={pathname.includes("/menu")}>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                          pathname.includes("/menu") && "hover:text-slate-200"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <MdRestaurantMenu className="shrink-0 h-6 w-6" />
                            <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Menu
                            </span>
                          </div>
                          <div className="flex shrink-0 ml-2">
                            <TfiAngleDown
                              className={`${open && "rotate-180"}`}
                            />
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-9 mt-1 ${!open && "hidden"}`}>
                          {category && category?.length > 0 ? (
                            category.map((item, index) => {
                              return (
                                <li
                                  key={new Date().getTime() + index}
                                  className="mb-1 last:mb-0"
                                >
                                  <Link
                                    href={`/menu/${item.name}`}
                                    className="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                                  >
                                    <span className="text-sm font-medium capitalize lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                      {item.name}
                                    </span>
                                  </Link>
                                </li>
                              );
                            })
                          ) : (
                            <li className="mb-1 last:mb-0">
                              <Link
                                href={`/menu/create`}
                                className="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                              >
                                <span className="text-sm font-medium capitalize lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                  Create Menu
                                </span>
                              </Link>
                            </li>
                          )}
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              {/* Gallery */}
              <li
                className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                  pathname.includes("/gallery") && "bg-slate-900"
                }`}
              >
                <Link
                  href="/gallery"
                  className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                    pathname.includes("/gallery") && "hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center">
                    <RiGalleryFill className="shrink-0 h-6 w-6" />
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Gallery
                    </span>
                  </div>
                </Link>
              </li>

              {/* Contacts */}
              <li
                className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                  pathname.includes("/contact") && "bg-slate-900"
                }`}
              >
                <Link
                  href="/contact"
                  className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                    pathname.includes("/contact") && "hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center">
                    <MdPermContactCalendar className="shrink-0 h-6 w-6" />
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Contacts
                    </span>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="px-3 py-2">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg
                className="w-6 h-6 fill-current sidebar-expanded:rotate-180"
                viewBox="0 0 24 24"
              >
                <path
                  className="text-slate-400"
                  d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z"
                />
                <path className="text-slate-600" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
