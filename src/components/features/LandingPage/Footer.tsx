import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-8 relative z-0">
      <div className="container mx-auto px-8">
        <div className="grid md:grid-cols-[2fr_1fr_1fr] gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              About the EQUIP | ACLA Building Project
            </h3>
            <p className="text-gray-300">
              The EQUIP | ACLA Building Project is a Christ-centered initiative
              to create a space for worship, discipleship, and community
              transformation. Designed to equip all generations, the building
              will feature a worship center, discipleship hub, youth and
              children’s facilities, and a media platform to spread the Gospel
              globally.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a
                href={"https://www.facebook.com/EquipMediaMamushaFenta"}
                className="text-gray-300 hover:text-accent"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href={"https://www.youtube.com/@equipmedia2577"}
                className="text-gray-300 hover:text-accent"
              >
                <span className="sr-only">Youtube</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 -3 20 20"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <title>youtube [#168]</title>
                  <desc>Created with Sketch.</desc>
                  <defs></defs>
                  <g
                    id="Page-1"
                    stroke="none"
                    stroke-width="1"
                    fill="none"
                    fill-rule="evenodd"
                  >
                    <g
                      id="Dribbble-Light-Preview"
                      transform="translate(-300.000000, -7442.000000)"
                      fill="currentColor"
                    >
                      <g
                        id="icons"
                        transform="translate(56.000000, 160.000000)"
                      >
                        <path
                          d="M251.988432,7291.58588 L251.988432,7285.97425 C253.980638,7286.91168 255.523602,7287.8172 257.348463,7288.79353 C255.843351,7289.62824 253.980638,7290.56468 251.988432,7291.58588 M263.090998,7283.18289 C262.747343,7282.73013 262.161634,7282.37809 261.538073,7282.26141 C259.705243,7281.91336 248.270974,7281.91237 246.439141,7282.26141 C245.939097,7282.35515 245.493839,7282.58153 245.111335,7282.93357 C243.49964,7284.42947 244.004664,7292.45151 244.393145,7293.75096 C244.556505,7294.31342 244.767679,7294.71931 245.033639,7294.98558 C245.376298,7295.33761 245.845463,7295.57995 246.384355,7295.68865 C247.893451,7296.0008 255.668037,7296.17532 261.506198,7295.73552 C262.044094,7295.64178 262.520231,7295.39147 262.895762,7295.02447 C264.385932,7293.53455 264.28433,7285.06174 263.090998,7283.18289"
                          id="youtube-[#168]"
                        ></path>
                      </g>
                    </g>
                  </g>
                </svg>
              </a>
              <a
                href={"https://soundcloud.com/equip-media"}
                className="text-gray-300 hover:text-accent"
              >
                <span className="sr-only">Sound Cloud</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  version="1.1"
                  id="Icons"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 32 32"
                  xmlSpace="preserve"
                >
                  <g>
                    <path
                      d="M26,25H16c-0.6,0-1-0.4-1-1V8.1c0-0.5,0.4-0.9,0.9-1C16.3,7,16.7,7,17,7c3.2,0,6.4,2.7,7.5,6.2c0.5-0.1,1-0.2,1.5-0.2
		c3.3,0,6,2.7,6,6S29.3,25,26,25z"
                    />
                  </g>
                  <g>
                    <path d="M13,25c-0.6,0-1-0.4-1-1V10c0-0.6,0.4-1,1-1s1,0.4,1,1v14C14,24.6,13.6,25,13,25z" />
                  </g>
                  <g>
                    <path d="M10,24c-0.6,0-1-0.4-1-1v-7c0-0.6,0.4-1,1-1s1,0.4,1,1v7C11,23.6,10.6,24,10,24z" />
                  </g>
                  <g>
                    <path d="M7,25c-0.6,0-1-0.4-1-1V13c0-0.6,0.4-1,1-1s1,0.4,1,1v11C8,24.6,7.6,25,7,25z" />
                  </g>
                  <g>
                    <path d="M4,24c-0.6,0-1-0.4-1-1v-6c0-0.6,0.4-1,1-1s1,0.4,1,1v6C5,23.6,4.6,24,4,24z" />
                  </g>
                  <g>
                    <path d="M1,23c-0.6,0-1-0.4-1-1v-4c0-0.6,0.4-1,1-1s1,0.4,1,1v4C2,22.6,1.6,23,1,23z" />
                  </g>
                </svg>
              </a>
              <a
                href={"https://t.me/Mamusha_Fenta"}
                className="text-gray-300 hover:text-accent"
              >
                <span className="sr-only">Telegram</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  aria-hidden="true"
                  viewBox="0 0 32 32"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>telegram</title>
                  <path d="M22.122 10.040c0.006-0 0.014-0 0.022-0 0.209 0 0.403 0.065 0.562 0.177l-0.003-0.002c0.116 0.101 0.194 0.243 0.213 0.403l0 0.003c0.020 0.122 0.031 0.262 0.031 0.405 0 0.065-0.002 0.129-0.007 0.193l0-0.009c-0.225 2.369-1.201 8.114-1.697 10.766-0.21 1.123-0.623 1.499-1.023 1.535-0.869 0.081-1.529-0.574-2.371-1.126-1.318-0.865-2.063-1.403-3.342-2.246-1.479-0.973-0.52-1.51 0.322-2.384 0.221-0.23 4.052-3.715 4.127-4.031 0.004-0.019 0.006-0.040 0.006-0.062 0-0.078-0.029-0.149-0.076-0.203l0 0c-0.052-0.034-0.117-0.053-0.185-0.053-0.045 0-0.088 0.009-0.128 0.024l0.002-0.001q-0.198 0.045-6.316 4.174c-0.445 0.351-1.007 0.573-1.619 0.599l-0.006 0c-0.867-0.105-1.654-0.298-2.401-0.573l0.074 0.024c-0.938-0.306-1.683-0.467-1.619-0.985q0.051-0.404 1.114-0.827 6.548-2.853 8.733-3.761c1.607-0.853 3.47-1.555 5.429-2.010l0.157-0.031zM15.93 1.025c-8.302 0.020-15.025 6.755-15.025 15.060 0 8.317 6.742 15.060 15.060 15.060s15.060-6.742 15.060-15.060c0-8.305-6.723-15.040-15.023-15.060h-0.002q-0.035-0-0.070 0z"></path>
                </svg>
              </a>
            </div>
            <p className="text-gray-300">
              Email:{" "}
              <a href={`mailto:equipmediainc@gmail.com`}>
                equipmediainc@gmail.com
              </a>
            </p>
            <p className="text-gray-300">
              Phone:{" "}
              <a href={`tel:${process.env.NEXT_PUBLIC_OFFICE_NUMBER}`}>
                {process.env.NEXT_PUBLIC_OFFICE_NUMBER}
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Useful Links</h3>

            <p className="text-gray-300 hover:underline">
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://equipemedia.com/"
              >
                Equip Media Website
              </Link>
            </p>
            <p className="text-gray-300 hover:underline">
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://aclachurch.org/"
              >
                ACLA Website
              </Link>
            </p>
            <p className="text-gray-300 hover:underline">
              <Link href="/auth/login">Admin Login</Link>
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>
            &copy; 2025 - EQUIP | ACLA Building Project. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
