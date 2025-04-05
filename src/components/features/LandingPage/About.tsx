import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function About() {
  return (
    <section id="why" className="bg-accent relative z-0 group overflow-hidden">
      <div className="group-has-[button:hover]:scale-100 scale-105 transition-all duration-300 delay-100 absolute inset-0 px-16 bg-white/60">
        <div className="group-has-[button:hover]:scale-100 rounded-3xl scale-105 transition-all duration-300 delay-200 absolute inset-4 px-16 bg-white/70">
          <div className="group-has-[button:hover]:scale-100 rounded-3xl scale-105 transition-all duration-300 delay-300 absolute inset-8 px-16 bg-white/80">
            <div className="group-has-[button:hover]:scale-100 rounded-3xl scale-105 transition-all duration-300 delay-400 absolute inset-16 px-16 bg-white/90">
              <div className="group-has-[button:hover]:scale-100 rounded-3xl scale-105 transition-all duration-300 delay-500 absolute inset-32 px-16 bg-white">
              </div>
            </div>
          </div>
        </div>
        </div>
        <div className="container py-32 mx-auto px-8 relative z-10">
          <h2 className="text-4xl font-bold text-center text-primary mb-8 max-w-xl mx-auto">
            Building a Legacy of Faith and Service in Addis Ababa
          </h2>
          <h3 className="text-2xl text-center text-primary mb-12 max-w-xl mx-auto">
            Join us as we construct a new hub for worship, leadership training,
            and global outreach
          </h3>
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <Image
                src="https://images.pexels.com/photos/3633711/pexels-photo-3633711.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Community story"
                width={300}
                height={200}
                className="rounded-none border"
              />
              <Image
                src="https://images.pexels.com/photos/2351723/pexels-photo-2351723.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Church concept"
                width={300}
                height={200}
                className="rounded-none border"
              />
              <Image
                src="https://images.pexels.com/photos/2330141/pexels-photo-2330141.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Outreach program"
                width={300}
                height={200}
                className="rounded-none border"
              />
            </div>
            <div className="max-w-lg text-center">
              <p className="text-primary mb-6">
                ACLA&apos;s mission is to uplift the community through spiritual
                growth and service. Our new facility will be a space for worship,
                education, and outreach, aligning with our &quot;Hear to the
                Nations&quot; theme and extending ACLA&apos;s impact globally.
              </p>
              <Button
                className="rounded-none"
                onClick={() =>
                  document
                    .getElementById("donation")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Make a Difference Today
              </Button>
            </div>
          </div>
      </div>
    </section>
  );
}
