import sampleDesign from "../assets/landing-mockupp.png";
import categoryLanding from "../assets/Category-landing.jpg";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const nav = useNavigate();

  const handleToAuth = () => {
    nav("/auth");
  };

  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const section4Ref = useRef(null);
  const section5Ref = useRef(null);

  const isSection1InView = useInView(section1Ref);
  const isSection2InView = useInView(section2Ref);
  const isSection3InView = useInView(section3Ref);
  const isSection4InView = useInView(section4Ref);
  const isSection5InView = useInView(section5Ref);

  return (
    <div className="overflow-x-hidden">
      {/* <div>
        <div className="absolute bg-contain bg-no-repeat w-20 h-20 " style={{backgroundImage: `url(${sampleLogo})`}}></div>
      </div>
       */}
      {/* Section 1 */}
      <section className="relative min-h-screen" ref={section1Ref}>
        <div className="h-full w-full">
          <div className="ml-20 mt-12 flex h-full flex-col">
            <motion.div
              initial={{ opacity: 0, x: -100, filter: "blur(5px)" }}
              animate={
                isSection1InView
                  ? { opacity: 1, x: 0, filter: "blur(0)" }
                  : { opacity: 0, x: -100, filter: "blur(5px)" }
              }
              transition={{ duration: 1 }}
            >
              <p className="bg-gradient-to-r from-[#4c9182] to-[#efd293] bg-clip-text text-8xl font-semibold text-transparent">
                Wise tracking <br /> and saving <br /> with ease
              </p>
              <div className="mt-3 w-[30rem] text-[#7a958f]">
                <p>
                  Take control of your finances effortlessly with WaEase.
                  Whether you're managing a monthly budget, saving for the
                  future, or simply keeping track of daily spending, WaEase
                  offers a seamless way to organize your finances.
                </p>
                <Button onClick={handleToAuth} className="mt-5 p-5 opacity-75">
                  {" "}
                  Get Started{" "}
                </Button>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, filter: "blur(5px)", x: 90 }}
            animate={
              isSection1InView
                ? { opacity: 1, x: 100, filter: "blur(0)" }
                : { opacity: 0, x: 90, filter: "blur(5px)" }
            }
            transition={{ duration: 1 }}
          >
            <div
              className="absolute right-0 top-[-13rem] mr-[6rem] h-[350px] w-[550px] bg-cover bg-no-repeat"
              style={{
                backgroundImage: `url(${sampleDesign})`,
                zIndex: 1,
                maxWidth: "100vw",
                overflow: "hidden",
              }}
            ></div>
            <div
              className="absolute right-32 top-[-475px] mr-48 h-[600px] w-[550px] bg-cover bg-no-repeat shadow-2xl"
              style={{
                backgroundImage: `url(${categoryLanding})`,
                zIndex: -1,
                maxWidth: "100vw",
                overflow: "hidden",
              }}
            ></div>
          </motion.div>

          {/* Gradient background */}
          <div
            className="absolute bottom-0 left-0 h-2/3 w-full bg-gradient-to-r from-[#4c9182] to-[#efd293]"
            style={{
              clipPath: "polygon(0 70%, 100% 0, 100% 100%, 0 100%)",
              top: "30%",
              height: "70%",
              zIndex: -1,
            }}
          ></div>
        </div>
      </section>

      {/* Section 2 */}
      <motion.div ref={section2Ref}>
        <section className="text-darkCopper relative flex min-h-screen flex-col items-center justify-center bg-[#f2e7dd]">
          <motion.div
            initial={{ opacity: 0, y: 50, filter: "blur(5px)" }}
            animate={
              isSection2InView
                ? { opacity: 1, y: 0, filter: "blur(0)" }
                : { opacity: 0, y: 50, filter: "blur(5px)" }
            }
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="mx-auto h-20 w-4/5 p-6 text-center">
              <h1 className="mb-6 text-4xl font-bold">Our Mission</h1>
              <p className="text-lg leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </motion.div>
        </section>
      </motion.div>

      {/* Section 3 */}
      <div className="bg-gradient-to-r from-[#4c9182] to-[#efd293] text-white">
        {/* Feature 1 */}
        <section
          className="relative grid min-h-screen grid-cols-2"
          ref={section3Ref}
        >
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={
              isSection3InView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }
            }
            transition={{ duration: 1, delay: 0.5 }}
            className="flex items-center justify-center"
          >
            <div className="flex w-80 flex-col items-center justify-center text-center">
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isSection3InView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 50 }
                }
                transition={{ duration: 1, delay: 0.5 }}
                className="p-5 text-5xl"
              >
                Expense Tracking
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isSection3InView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 50 }
                }
                transition={{ duration: 1, delay: 0.5 }}
                className="p-5 text-lg"
              >
                Effortlessly track your spending by logging expense names,
                quantities, and amounts, with totals automatically calculated
                for you. Get instant when you’re about to exceed your category
                budgets, helping you stay on track with your financial goals and
                make informed spending decisions.
              </motion.p>
            </div>
          </motion.div>
        </section>

        {/* Feature 2 */}
        <section
          className="relative col-start-2 grid min-h-screen grid-cols-2"
          ref={section4Ref}
        >
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={
              isSection4InView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }
            }
            transition={{ duration: 1, delay: 0.5 }}
            className="col-start-2 flex items-center justify-center"
          >
            <div className="flex w-80 flex-col items-center justify-center text-center">
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isSection4InView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 50 }
                }
                transition={{ duration: 1, delay: 0.5 }}
                className="p-5 text-5xl"
              >
                Budgeting Made Simple
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isSection4InView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 50 }
                }
                transition={{ duration: 1, delay: 0.5 }}
                className="p-5 text-lg"
              >
                Easily create personalized spending categories, allocate
                budgets, and monitor your expenses with ease. Keep your finances
                organized and gain insights with intuitive progress bars and
                detailed budget summaries.
              </motion.p>
            </div>
          </motion.div>
        </section>

        {/* Feature 3 */}
        <section
          className="relative grid min-h-screen grid-cols-2"
          ref={section5Ref}
        >
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={
              isSection5InView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }
            }
            transition={{ duration: 1, delay: 0.5 }}
            className="flex items-center justify-center"
          >
            <div className="flex w-80 flex-col items-center justify-center text-center">
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isSection5InView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 50 }
                }
                transition={{ duration: 1, delay: 0.5 }}
                className="p-5 text-5xl"
              >
                Comprehensive Weekly Summary
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isSection5InView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 50 }
                }
                transition={{ duration: 1, delay: 0.5 }}
                className="p-5 text-lg"
              >
                Detailed weekly summaries that offer a thorough analysis of your
                spending, savings, and budget performance. Gain valuable
                insights into your financial habits with easy-to-understand
                reports and visual graphs, helping you make informed decisions
                for the upcoming weeks.
              </motion.p>
            </div>
          </motion.div>
        </section>
      </div>
      {/* footer */}
      <section className="bg-darkCopper relative flex h-60 flex-col items-center justify-center">
        <div className="font-medium text-white">
          <h3>Never lose track of your expenses again</h3>
          <h1>Dive in to the world of digital tracking</h1>
          <Button
            onClick={handleToAuth}
            className="bg-vanilla text-darkCopper hover:text-vanilla mt-4 items-center justify-center px-5 align-middle"
          >
            {" "}
            Track Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
