USE [Resolvely]
GO
/****** Object:  StoredProcedure [dbo].[ShareStory_Select_ById]    Script Date: 1/29/2024 3:49:41 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Jerson Martinez
-- Create date: 1/23/2024
-- Description: A proc to select by Id
-- Code Reviewer: Xavier Robles

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE proc [dbo].[ShareStory_Select_ById]

				@Id int

 as 
 /*

	Declare @Id int = 28 

	Execute dbo.ShareStory_Select_ById @Id

 */
BEGIN

SELECT [Id]
      ,[Name]
      ,[Email]
	  ,[Story]
      ,[CreatedBy]
      ,[IsApproved]
      ,[ApprovedBy]
      ,[DateCreated]
      ,[DateModified]
  FROM [dbo].[ShareStory]
	Where Id = @Id

END
GO
