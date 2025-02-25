/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "sst-web3-boilerplate",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const REOWN_PROJECT_ID = new sst.Secret("REOWN_PROJECT_ID")
    console.log(REOWN_PROJECT_ID.value);
    // const [{ tables }, { apis }] = await Promise.all([
    //   import("./infra/storage"),
    //   import("./infra/api")
    // ]);
    new sst.aws.Nextjs("Frontend", {
      path: "frontend",
      link: [REOWN_PROJECT_ID],
      environment: {
        NEXT_PUBLIC_APP_REGION: aws.getRegionOutput().name,
        NEXT_PUBLIC_REOWN_PROJECT_ID: REOWN_PROJECT_ID.value, // updated variable name
      }
    });

    // return {
    //   myApi: apis.myApi.url,
    // }
  },
});
