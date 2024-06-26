USE [Resolvely]
GO
/****** Object:  Table [dbo].[ShareStory]    Script Date: 1/29/2024 3:49:41 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ShareStory](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Email] [nvarchar](50) NOT NULL,
	[Story] [nvarchar](3000) NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[IsApproved] [bit] NOT NULL,
	[ApprovedBy] [int] NULL,
	[DateCreated] [datetime2](7) NOT NULL,
	[DateModified] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ShareStory] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[ShareStory] ADD  CONSTRAINT [DF_ShareStoryFiles_IsApproved]  DEFAULT ((0)) FOR [IsApproved]
GO
ALTER TABLE [dbo].[ShareStory] ADD  CONSTRAINT [DF_ShareStoryFiles_DateCreated]  DEFAULT (getutcdate()) FOR [DateCreated]
GO
ALTER TABLE [dbo].[ShareStory] ADD  CONSTRAINT [DF_ShareStoryFiles_DateModified]  DEFAULT (getutcdate()) FOR [DateModified]
GO
ALTER TABLE [dbo].[ShareStory]  WITH CHECK ADD  CONSTRAINT [FK_ShareStory_Users] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[ShareStory] CHECK CONSTRAINT [FK_ShareStory_Users]
GO
ALTER TABLE [dbo].[ShareStory]  WITH CHECK ADD  CONSTRAINT [FK_ShareStory_Users1] FOREIGN KEY([ApprovedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[ShareStory] CHECK CONSTRAINT [FK_ShareStory_Users1]
GO
