import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import "./AstraAI.css";

import {
  askAstra,
  type AstraHistoryMessage,
} from "../../services/astraService";

type AstraAIProps = {
  onClose?: () => void;
};

type ChatMessage = {
  role: "user" | "astra";
  message: string;
};

type AstraState =
  | "open"
  | "closing"
  | "closed"
  | "opening";

export default function AstraAI({
  onClose,
}: AstraAIProps) {

  const [state, setState] =
    useState<AstraState>("open");

  const [
    showGreeting,
    setShowGreeting,
  ] = useState(false);

  const [
    showDescription,
    setShowDescription,
  ] = useState(false);

  const [
    showInput,
    setShowInput,
  ] = useState(false);

  const [
    input,
    setInput,
  ] = useState("");

  const [
    messages,
    setMessages,
  ] = useState<ChatMessage[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const inputRef =
    useRef<HTMLInputElement>(null);

  const messagesRef =
    useRef<HTMLDivElement>(null);


  /* =====================================================
     OPEN INTRO ANIMATION
     ===================================================== */

  useEffect(() => {

    if (
      state !== "open" &&
      state !== "opening"
    ) {
      return;
    }

    const greetingTimer =
      window.setTimeout(() => {
        setShowGreeting(true);
      }, 320);

    const descriptionTimer =
      window.setTimeout(() => {
        setShowDescription(true);
      }, 580);

    const inputTimer =
      window.setTimeout(() => {
        setShowInput(true);
      }, 850);

    return () => {
      window.clearTimeout(
        greetingTimer
      );

      window.clearTimeout(
        descriptionTimer
      );

      window.clearTimeout(
        inputTimer
      );
    };

  }, [state]);


  /* =====================================================
     AUTO SCROLL
     ===================================================== */

  useEffect(() => {

    if (messagesRef.current) {

      messagesRef.current.scrollTop =
        messagesRef.current.scrollHeight;

    }

  }, [messages, loading]);


  /* =====================================================
     OPEN ASTRA
     ===================================================== */

  const openAstra = () => {

    if (state !== "closed") {
      return;
    }

    setState("opening");

    setShowGreeting(false);
    setShowDescription(false);
    setShowInput(false);

    window.setTimeout(() => {

      setState("open");

      window.setTimeout(() => {
        inputRef.current?.focus();
      }, 150);

    }, 40);
  };


  /* =====================================================
     CLOSE ASTRA

     IMPORTANT:
     The component is NOT unmounted.
     CSS gets the full closing animation.
     ===================================================== */

  const closeAstra = () => {

    if (state !== "open") {
      return;
    }

    if (loading) {
      return;
    }

    setState("closing");

    setShowGreeting(false);
    setShowDescription(false);
    setShowInput(false);

    window.setTimeout(() => {

      setState("closed");

      if (onClose) {
        onClose();
      }

    }, 900);
  };


  /* =====================================================
     SEND MESSAGE TO LOCAL ASTRA BACKEND
     ===================================================== */

  const sendMessage = async () => {

    const message =
      input.trim();

    if (
      !message ||
      loading ||
      state !== "open"
    ) {
      return;
    }


    /* -----------------------------------------------
       USER MESSAGE APPEARS IMMEDIATELY
       ----------------------------------------------- */

    setMessages(
      (previous) => [
        ...previous,

        {
          role: "user",
          message,
        },
      ]
    );


    /* -----------------------------------------------
       CLEAR INPUT IMMEDIATELY
       ----------------------------------------------- */

    setInput("");

    /* -----------------------------------------------
       ACTIVATE SWORD / THINKING ANIMATION
       ----------------------------------------------- */

    setLoading(true);


    try {

      /*
       * Send the current conversation context to the local Astra backend so Astra
       * understands the current conversation context.
       *
       * We intentionally limit the history so the popup
       * stays lightweight and requests remain compact.
       */

      const recentMessages =
        messages.slice(-10);

      const history:
        AstraHistoryMessage[] =
        recentMessages.map(
          (item) => ({
            role: item.role,
            message: item.message,
          })
        );


      /* ---------------------------------------------
         REAL LOCAL ASTRA API CALL
         --------------------------------------------- */

      const fullResponse =
        await askAstra(
          message,
          history
        );


      /* ---------------------------------------------
         Tiny delay keeps the energy animation visible
         instead of flashing for a few milliseconds.
         --------------------------------------------- */

      await new Promise<void>(
        (resolve) => {

          window.setTimeout(
            resolve,
            300
          );

        }
      );


      /* ---------------------------------------------
         ASTRA RESPONSE
         --------------------------------------------- */

      setMessages(
        (previous) => [
          ...previous,

          {
            role: "astra",
            message: fullResponse.message,
          },
        ]
      );

      /* HANDLE MAP ACTIONS */
      if (fullResponse.action?.type === "focus_vehicle") {
        const event = new CustomEvent("astra-focus-vehicle", {
          detail: {
            vehicleId: fullResponse.action.vehicle_id,
          },
        });
        window.dispatchEvent(event);
      }

    } catch (error) {

      console.error(
        "Astra local backend error:",
        error
      );


      let errorMessage =
        "Mission link interrupted. Please make sure the local Astra backend is running.";


      if (
        error instanceof Error &&
        error.message ===
          "ASTRA_LOCAL_BACKEND_UNAVAILABLE"
      ) {

        errorMessage =
          "Mission link interrupted. Please start the MissionFlow FastAPI backend on port 8000.";

      }


      setMessages(
        (previous) => [
          ...previous,

          {
            role: "astra",
            message: errorMessage,
          },
        ]
      );

    } finally {

      setLoading(false);

      window.setTimeout(() => {

        inputRef.current?.focus();

      }, 100);

    }
  };


  /* =====================================================
     ENTER KEY
     ===================================================== */

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      void sendMessage();
    }
  };


  /* =====================================================
     RENDER
     ===================================================== */

  return (

    <div
      className={
        `astra-system astra-state-${state}`
      }
    >


      {/* =================================================
          PERSISTENT HOLOGRAPHIC SWORD
          NEVER UNMOUNTED
          ================================================= */}

      <div
        className="astra-hologram"
        aria-hidden="true"
      >

        <div
          className="astra-energy aura-one"
        />

        <div
          className="astra-energy aura-two"
        />

        <div
          className="astra-beam beam-one"
        />

        <div
          className="astra-beam beam-two"
        />

        <div
          className="astra-ring ring-one"
        />

        <div
          className="astra-ring ring-two"
        />


        <div className="astra-logo-wrapper">

          <div className="astra-logo-glow" />

          <div className="astra-symbol">

            <div
              className="astra-symbol-top"
            />

            <div
              className="astra-symbol-body"
            >
              <div
                className="astra-symbol-core"
              />
            </div>

            <div
              className="astra-symbol-bottom"
            />

          </div>

        </div>


        <div
          className="astra-spark sparkle-one"
        >
          ?
        </div>

        <div
          className="astra-spark sparkle-two"
        >
          ?
        </div>

        <div
          className="astra-spark sparkle-three"
        >
          ?
        </div>

      </div>


      {/* =================================================
          THINKING ENERGY
          ================================================= */}

      {loading && (

        <div className="astra-thinking-aura">

          <div
            className="thinking-wave wave-one"
          />

          <div
            className="thinking-wave wave-two"
          />

          <div
            className="thinking-wave wave-three"
          />

        </div>

      )}


      {/* =================================================
          CHAT CARD
          ALWAYS MOUNTED
          ================================================= */}

      <section className="astra-card">

        <div className="astra-card-shine" />


        <button
          className="astra-close"
          onClick={closeAstra}
          disabled={loading}
          aria-label="Collapse Astra AI"
        >
          ×
        </button>


        <div className="astra-card-content">


          {/* ---------------------------------------------
             STATUS
             --------------------------------------------- */}

          <div className="astra-status">

            <span
              className="astra-status-dot"
            />

            ASTRA AI ONLINE

          </div>


          {/* ---------------------------------------------
             INITIAL GREETING
             --------------------------------------------- */}

          {showGreeting &&
            messages.length === 0 && (

            <div className="astra-greeting">

              Hey Devraj, I&apos;m Astra AI

              <span>
                ✦
              </span>

            </div>

          )}


          {showDescription &&
            messages.length === 0 && (

            <div className="astra-description">

              <div>
                Your intelligent mission
                co-pilot.
              </div>

              <div>
                How may I help you today?
              </div>

            </div>

          )}


          {/* ---------------------------------------------
             CHAT HISTORY
             --------------------------------------------- */}

          {messages.length > 0 && (

            <div
              className="astra-chat-messages"
              ref={messagesRef}
            >

              {messages.map(
                (item, index) => (

                <div
                  key={
                    `${item.role}-${index}`
                  }
                  className={[
                    "astra-chat-message",

                    item.role === "user"
                      ? "astra-user-message"
                      : "astra-response-message",

                  ].join(" ")}
                >

                  <div
                    className="astra-message-label"
                  >
                    {item.role === "user"
                      ? "YOU"
                      : "ASTRA"}
                  </div>


                  <div
                    className="astra-message-text"
                  >
                    {item.message}
                  </div>

                </div>

              ))}


              {/* -----------------------------------------
                 THINKING INDICATOR
                 ----------------------------------------- */}

              {loading && (

                <div
                  className="
                    astra-chat-message
                    astra-response-message
                  "
                >

                  <div
                    className="astra-message-label"
                  >
                    ASTRA
                  </div>


                  <div
                    className="astra-thinking"
                  >

                    <div
                      className="
                        astra-thinking-glyphs
                      "
                    >

                      <span />
                      <span />
                      <span />

                    </div>


                    <em>
                      Astra is thinking...
                    </em>

                  </div>

                </div>

              )}

            </div>

          )}


          {/* ---------------------------------------------
             INPUT
             --------------------------------------------- */}

          {showInput && (

            <div
              className="astra-input-wrapper"
            >

              <input
                ref={inputRef}

                className="astra-input"

                value={input}

                onChange={(event) => {
                  setInput(
                    event.target.value
                  );
                }}

                onKeyDown={handleKeyDown}

                placeholder={
                  loading
                    ? "Astra is thinking..."
                    : "Ask Astra anything..."
                }

                disabled={loading}

                maxLength={2000}

                autoComplete="off"
              />


              <button
                className="astra-send"

                onClick={() => {
                  void sendMessage();
                }}

                disabled={
                  loading ||
                  !input.trim()
                }
              >

                {loading
                  ? "..."
                  : "Send"}

              </button>

            </div>

          )}

        </div>


        {/* ---------------------------------------------
           GLASS CARD CORNERS
           --------------------------------------------- */}

        <div
          className="
            astra-card-corner
            corner-tl
          "
        />

        <div
          className="
            astra-card-corner
            corner-tr
          "
        />

        <div
          className="
            astra-card-corner
            corner-bl
          "
        />

        <div
          className="
            astra-card-corner
            corner-br
          "
        />

      </section>


      {/* =================================================
          BOTTOM-RIGHT FLOATING SWORD
          ================================================= */}

      <button
        className="astra-floating-trigger"

        onClick={openAstra}

        aria-label="Open Astra AI"
      >

        <span
          className="astra-trigger-burst"
        />

        <span
          className="
            astra-trigger-ring
            ring-a
          "
        />

        <span
          className="
            astra-trigger-ring
            ring-b
          "
        />


        <span
          className="astra-trigger-sword"
        >

          <span
            className="trigger-sword-glow"
          />

          <span
            className="trigger-sword-top"
          />

          <span
            className="trigger-sword-body"
          >

            <span
              className="trigger-sword-core"
            />

          </span>

          <span
            className="trigger-sword-bottom"
          />

        </span>


        <span
          className="astra-trigger-status"
        >

          <span />

          ASTRA

        </span>

      </button>

    </div>
  );
}






