import {
  Toast,
  Toaster,
  ToasterStore,
  Transition,
  useToaster,
} from "solid-headless";
import { For, createSignal, JSX, onMount } from "solid-js";
import { css, styled } from "solid-styled-components";
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo } from "solid-icons/fi";
interface ToastPropsData {
  type?: "error" | "success" | "info";
  message: string | JSX.Element;
  duration?: number;
}

export const notifications = new ToasterStore<ToastPropsData>();

export const useToast = () => useToaster(notifications);

interface ToastProps {
  data: ToastPropsData;
  id: string;
}

const Styles = {
  ToasterWrapper: styled("div")`
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
  `,
  Toast: styled("div")`
    width: 400px;
    max-width: 90%;
    background: var(--surface);
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 24px;
    box-shadow: 0px 24px 24px -24px rgba(0, 0, 0, 0.25);
    .content {
      flex: 1;
    }
    .close {
      all: unset;
      padding: 4px;
      background: var(--surface);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 4px;
      &:hover {
        filter: brightness(0.975);
      }
    }
  `,
};

const toastIcons = {
  error: FiAlertCircle,
  success: FiCheckCircle,
  info: FiInfo,
};

const toastColors = {
  error: "#F87171",
  success: "#34D399",
  info: "#60A5FA",
};

function SingleToast(props: ToastProps) {
  const [isOpen, setIsOpen] = createSignal(true);
  const Icon = toastIcons[props.data.type || "info"];
  onMount(() => {
    setTimeout(() => {
      setIsOpen(false);
    }, props.data.duration || 3000);
  });
  return (
    <Transition
      class={css`
        transition: 0.2s ease-out;
        overflow: hidden;
      `}
      enter={css``}
      enterFrom={css`
        opacity: 0;
        max-height: 0px;
      `}
      enterTo={css`
        opacity: 1;
        max-height: 100px;
      `}
      leaveFrom={css`
        opacity: 1;
        max-height: 100px;
      `}
      leaveTo={css`
        opacity: 0;
        max-height: 0px;
      `}
      show={isOpen()}
      afterLeave={() => notifications.remove(props.id)}
    >
      <Toast>
        <Styles.Toast>
          <span class="icon">
            <Icon size={24} color={toastColors[props.data.type || "info"]} />
          </span>
          <div class="content">{props.data.message}</div>
          <button onClick={() => setIsOpen(false)} class="close">
            <FiX />
          </button>{" "}
        </Styles.Toast>
      </Toast>
    </Transition>
  );
}

export function TodoToaster() {
  const notifs = useToast();

  return (
    <Styles.ToasterWrapper>
      <Toaster id="toaster">
        <For each={notifs().slice(0).reverse()}>
          {(item) => {
            item.data.type = item.data.type || "info";
            item.data.duration = item.data.duration || 3000;
            return <SingleToast id={item.id} data={item.data} />;
          }}
        </For>
      </Toaster>
    </Styles.ToasterWrapper>
  );
}
