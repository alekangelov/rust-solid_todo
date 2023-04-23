import { createQuery } from "@tanstack/solid-query";
import { For, JSX, ParentProps } from "solid-js";
import { styled } from "solid-styled-components";
import { authFns } from "~/data";
import { Logo } from "../Logo";
import { FiClipboard, FiDatabase, FiLogOut, FiUser } from "solid-icons/fi";
import { A, useMatch } from "@solidjs/router";

const SidebarWrapper = styled("div")`
  padding: 24px;
  width: 360px;
  max-width: 30%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  position: sticky;
  top: 0;
  left: 0;
  & > div {
    background: var(--surface);
    width: 100%;
    height: calc(100vh - 48px);
    border-radius: 12px;
    padding: 24px;
  }
  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    span {
      font-size: 24px;
      font-weight: 900;
    }
  }
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    margin-top: 24px;
    li + li {
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      margin-top: 6px;
      padding-top: 6px;
    }
    a {
      display: flex;
      align-items: center;
      gap: 12px;
      span {
        display: flex;
      }
      font-weight: 900;
      text-decoration: none;
      color: var(--on-surface);
      transition: 0.2s ease-out color, 0.2s ease-out background;
      padding: 12px;
      border-radius: 8px;
      &:hover,
      &.active {
        background: var(--primary);
        color: var(--on-primary);
      }
      .icon {
        font-size: 24px;
      }
    }
  }
`;

interface LinkItem {
  title?: string;
  icon?: JSX.Element;
  href?: string;
  trailing?: JSX.Element;
}

function Sidebar() {
  const links: LinkItem[] = [
    { title: "Dashboard", icon: <FiDatabase />, href: "/dashboard" },
    { title: "Todos", icon: <FiClipboard />, href: "/todos" },

    { title: "Profile", icon: <FiUser />, href: "/profile" },
    { title: "Log Out", icon: <FiLogOut />, href: "/logout" },
  ];
  return (
    <SidebarWrapper>
      <div>
        <div class="logo">
          <Logo width={36} height={36} />
          <span>Todoifier</span>
        </div>
        <ul>
          <For each={links}>
            {(item) => {
              const match = useMatch(() => item.href || "/");
              return (
                <li>
                  <A href={item.href || ""}>
                    {item.icon && <span class="icon">{item.icon}</span>}
                    <span>{item.title}</span>
                  </A>
                </li>
              );
            }}
          </For>
        </ul>
      </div>
    </SidebarWrapper>
  );
}

const LayoutWrapper = styled("div")`
  display: flex;
  .content {
    flex: 1;
    padding-right: 24px;
    .route-name {
      font-size: 24px;
      font-weight: 900;
    }
    &-header {
      padding: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
    }
    &-body {
      min-height: 200vh;
    }
  }
`;

const avatarSize = {
  sm: 36,
  md: 48,
  lg: 64,
};

const AWrap = styled("div")<{ size: "sm" | "md" | "lg" }>`
  display: flex;
  width: ${(props) => avatarSize[props.size]}px;
  aspect-ratio: 1 / 1;
  font-size: ${(props) => avatarSize[props.size] / 2}px;
  align-items: center;
  justify-content: center;
  background: var(--primary);
  color: var(--on-primary);
  border-radius: 16px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Avatar = (props: { src?: string | null; size?: "sm" | "md" | "lg" }) => {
  let child = props.src ? <img src={props.src} /> : <FiUser />;
  return <AWrap size={props.size || "md"}>{child}</AWrap>;
};

export function Layout(props: ParentProps<{ name: string }>) {
  const me = createQuery(() => ["me"], authFns.me);
  const profile = createQuery(
    () => ["me.profile"],
    () => authFns.profile(me.data?.id)
  );
  return (
    <LayoutWrapper>
      <Sidebar />
      <div class="content">
        <div class="content-header">
          <span class="route-name">{props.name}</span>
          <span>
            <Avatar src={profile.data?.avatar} size="lg" />
          </span>
        </div>
        <div class="content-body">{props.children}</div>
      </div>
    </LayoutWrapper>
  );
}
