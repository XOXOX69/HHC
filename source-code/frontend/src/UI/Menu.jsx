import { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { cn } from "../utils/functions";

// Animated submenu wrapper component
function AnimatedSubmenu({ isOpen, children }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen, children]);

  return (
    <div
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{ height: `${height}px` }}
    >
      <ul ref={contentRef} className="pt-2">
        {children}
      </ul>
    </div>
  );
}

export default function Menu({
  items,
  className,
  permissions,
  collapsed,
  setCollapsed,
}) {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const newItems = items?.filter(Boolean) || [];
  const handleSubMenuClick = (subMenuKey) => {
    setOpenSubMenu((prev) => (prev === subMenuKey ? null : subMenuKey));
    if (collapsed) {
      setCollapsed(false);
    }
  };

  const renderSubMenuItems = (subMenu) => {
    return subMenu?.map((item, index) => {
      let content = null;

      if (
        item?.permit &&
        hasPermission(
          permissions,
          item.permit?.permissions,
          item.permit?.operator
        )
      ) {
        content = (
          <li 
            key={item?.key} 
            className='menu-item pl-8 py-2 my-1 font-Popins transform transition-all duration-200 hover:translate-x-1 hover:bg-white/5'
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className='flex items-center gap-1 w-full'>
              <span className='w-full'>{item?.label}</span>
            </div>
          </li>
        );
      } else if (!item?.permit) {
        content = (
          <li 
            key={item?.key} 
            className='menu-item pl-8 py-2 my-1 font-Popins transform transition-all duration-200 hover:translate-x-1 hover:bg-white/5'
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className='flex items-center gap-1 w-full'>
              <span className='w-full'>{item?.label}</span>
            </div>
          </li>
        );
      }

      return content;
    });
  };

  return (
    <ul className='bg-menuBg'>
      {newItems?.map((item, itemIndex) => {
        // rendering
        let itemContent = null;

        if (
          item?.permit &&
          hasPermission(
            permissions,
            item.permit.permissions,
            item.permit.operator
          )
        ) {
          itemContent = (
            <li
              key={item?.key}
              className={cn(
                "py-2 my-1 font-Popins transition-all duration-200",
                {
                  "pb-0": openSubMenu === item?.key && !collapsed,
                },
                {
                  "menu-item px-4 hover:bg-white/5": !item?.children,
                },
                {
                  "menu-item-with-children": item?.children,
                }
              )}
              style={{ animationDelay: `${itemIndex * 30}ms` }}
            >
              <div
                onClick={() => item?.children && handleSubMenuClick(item?.key)}
                className={cn(
                  "cursor-pointer flex justify-between group transition-all duration-200 rounded-md",
                  {
                    "px-4 hover:bg-white/5": item?.children,
                  },
                  {
                    "justify-start items-center ml-4 max-h-5 ": collapsed,
                  }
                )}
              >
                {collapsed ? (
                  <>
                    <span className='text-lg flex items-center transition-transform duration-200 group-hover:scale-110'>
                      {item?.icon}
                    </span>
                    <span className='w-full opacity-0'>{item?.label}</span>
                  </>
                ) : (
                  <>
                    <div className={cn("flex items-center gap-2 w-full")}>
                      <span className="transition-transform duration-200 group-hover:scale-110">
                        {item?.icon}
                      </span>
                      <span className='w-full transition-colors duration-200'>{item?.label}</span>
                    </div>
                    {item?.children && (
                      <span className='ml-auto text-gray-400 transition-transform duration-300'>
                        <IoIosArrowDown 
                          className={cn(
                            "transition-transform duration-300 ease-in-out",
                            { "rotate-180": openSubMenu === item?.key }
                          )}
                        />
                      </span>
                    )}
                  </>
                )}
              </div>
              {item?.children && !collapsed && (
                <AnimatedSubmenu isOpen={openSubMenu === item?.key}>
                  {renderSubMenuItems(item?.children)}
                </AnimatedSubmenu>
              )}
            </li>
          );
        } else if (!item?.permit) {
          itemContent = (
            <li
              key={item?.key}
              className={cn(
                "py-2 my-1 font-Popins transition-all duration-200",
                {
                  "pb-0": openSubMenu === item?.key && !collapsed,
                },
                {
                  "menu-item px-4 hover:bg-white/5": !item?.children,
                },
                {
                  "menu-item-with-children": item?.children,
                },
                {
                  "flex items-center": collapsed,
                }
              )}
              style={{ animationDelay: `${itemIndex * 30}ms` }}
            >
              <div
                onClick={() => item?.children && handleSubMenuClick(item?.key)}
                className={cn(
                  "cursor-pointer flex justify-between group transition-all duration-200 rounded-md",
                  {
                    "px-4 hover:bg-white/5": item?.children,
                  },
                  {
                    "justify-start items-center ml-4 max-h-5": collapsed,
                  }
                )}
              >
                {collapsed ? (
                  <>
                    <span className='text-lg flex items-center transition-transform duration-200 group-hover:scale-110'>
                      {item?.icon}
                    </span>
                    <span className='w-full opacity-0'>{item?.label}</span>
                  </>
                ) : (
                  <>
                    <div className={cn("flex items-center gap-2 w-full")}>
                      <span className="transition-transform duration-200 group-hover:scale-110">
                        {item?.icon}
                      </span>
                      <span className='w-full transition-colors duration-200'>{item?.label}</span>
                    </div>
                    {item?.children && (
                      <span className='ml-auto text-gray-400 transition-transform duration-300'>
                        <IoIosArrowDown 
                          className={cn(
                            "transition-transform duration-300 ease-in-out",
                            { "rotate-180": openSubMenu === item?.key }
                          )}
                        />
                      </span>
                    )}
                  </>
                )}
              </div>
              {item?.children && !collapsed && (
                <AnimatedSubmenu isOpen={openSubMenu === item?.key}>
                  {renderSubMenuItems(item?.children)}
                </AnimatedSubmenu>
              )}
            </li>
          );
        }

        return itemContent;
      })}
    </ul>
  );
}

function hasPermission(permissions, myPermissions, operator) {
  if (!myPermissions || !Array.isArray(permissions)) {
    return false;
  }

  if (!Array.isArray(myPermissions)) {
    myPermissions = [myPermissions];
  }

  if (operator === "or") {
    return permissions.some((permission) => myPermissions.includes(permission));
  } else if (operator === "and") {
    return myPermissions.every((permission) =>
      permissions.includes(permission)
    );
  } else {
    return myPermissions.every((permission) =>
      permissions.includes(permission)
    );
  }
}
