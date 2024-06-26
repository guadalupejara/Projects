USE [Resolvely]
GO
/****** Object:  StoredProcedure [dbo].[Comments_Select_ByEntityId]    Script Date: 2/21/2024 4:53:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Author:	Kendall Stephens
-- Create date: 1/31/2023
-- Description: Select Comments by EntityId
-- Code Reviewer: Aurel Aliy

-- MODIFIED BY: Samuel Ramirez
-- MODIFIED DATE: 2/21/2024
-- Code Reviewer: Aurel Aliy
-- =============================================
CREATE proc [dbo].[Comments_Select_ByEntityId]
			@EntityTypeId int,
			@EntityId int



as
/*
DECLARE		@EntityTypeId int = 1,
			@EntityId int = 21 


EXECUTE dbo.Comments_Select_ByEntityId @EntityTypeId, @EntityId

*/


BEGIN



	  SELECT c.[Id]
			 ,c.[Subject]
			 ,c.[Text]
			 ,c.[ParentId]
			 ,c.[EntityId]
			 ,c.[EntityTypeId]
			 ,e.[Name]as EntityName
			 ,[CreatedBy] = dbo.fn_GetUserJSON(c.CreatedBy)
			 ,c.[DateCreated]
			 ,c.[DateModified]
			 ,[reply]=(
						SELECT r.[Id] as ReplyId
							  ,r.[Subject]
							  ,r.[Text]
							  ,r.[ParentId]
							  ,r.[EntityId]
							  ,r.[EntityTypeId]
							  ,e.[Name] as EntityName
							  ,u.Id as UserId
							  ,u.FirstName
							  ,u.LastName
							  ,u.Mi
							  ,u.AvatarUrl							  
							  ,r.[DateCreated]
							  ,r.[DateModified]
						FROM [dbo].[Comments] as r 
						WHERE r.ParentId = c.Id 
						FOR JSON AUTO
						)
	  FROM [dbo].[Comments] as c inner join dbo.EntityTypes as e
	  ON c.EntityTypeId = e.Id 
	  inner join dbo.Users as u 
	  ON c.CreatedBy = u.Id
      WHERE @EntityId = c.EntityId and IsDeleted=0 and @EntityTypeId =c.EntityTypeId




END


GO
