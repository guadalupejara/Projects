USE [Resolvely]
GO
/****** Object:  StoredProcedure [dbo].[Users_SelectByEmail]    Script Date: 11/29/2023 1:56:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Luca Chitayat
-- Create date: 11/16/2023
-- Description:	 Select UserBase properties by Email, with RoleId selecting RoleType for "Role"
-- Code Reviewer: Jordin Camp

-- MODIFIED BY: Luca Chitayat
-- MODIFIED DATE: 11/28/2023
-- Code Reviewer:Thane Thompson
-- Note:Added AvatarUrl to select
-- =============================================



CREATE Proc [dbo].[Users_SelectByEmail]
	@Email nvarchar(255)

as

/*TestCode

Declare
@Email nvarchar(255) = 'HashedTest@gmail.com'

EXEC dbo.Users_SelectByEmail
@Email

Declare
@PageIndex int = 0
,@PageSize int = 3

EXEC dbo.Users_SelectAll
@PageIndex,@PageSize

*/


BEGIN


SELECT Users.[Id]
	  ,[Email]
	  ,"Role" = (SELECT [Name]
				FROM dbo.Roles as r inner join dbo.Users as u
				ON r.Id = u.RoleId
				WHERE u.Email = @Email)
	  ,[AvatarUrl]

  FROM [dbo].[Users] 
		WHERE Users.Email = @Email
 

  END

GO
