module.exports = {
  async up(db, client) {
    const menu = [{
        ID: 1,
        name: "dashboard",
        label: {
          key: "panel.dashboard",
        },
        url: "/dashboard",
        parentID: 0
      },
      {
        ID: 2,
        name: "program_management",
        label: {
          key: "resource.management",
          params: {
            item: 'models.program'
          }
        },
        url: "/programs/list",
        parentID: 0
      },
      {
        ID: 3,
        name: "app_management",
        label: {
          key: "resource.management",
          params: {
            item: 'models.app'
          }
        },
        parentID: 0
      },
      {
        ID: 4,
        name: "logs",
        label: {
          key: "panel.logs",
        },
        url: "/logs/list",
        parentID: 3
      }

    ]
    await db.collection('admin_menu').insertMany(menu);

  },

  async down(db, client) {
    await db.collection('admin_menu').drop();
  }
};